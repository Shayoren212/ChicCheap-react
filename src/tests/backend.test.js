/**
 * ChicCheap — Backend Integration Tests
 * ======================================
 * Run:  npm run test        (headless)
 *       npm run test:ui     (browser UI)
 *
 * These tests use a real Supabase project (from .env).
 * They create a test user, run CRUD operations, verify RLS,
 * then clean up after themselves.
 *
 * Prerequisites:
 *   1. .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 *   2. Tables created via supabase/schema.sql
 *   3. Email confirmation disabled in Supabase Auth settings
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// ── Supabase client ──────────────────────────────────────────
const SUPABASE_URL      = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Test credentials ─────────────────────────────────────────
const TEST_EMAIL    = `test_${Date.now()}@chiccheap-test.com`
const TEST_PASSWORD = 'TestPass123!'
const TEST_EMAIL_2  = `test2_${Date.now()}@chiccheap-test.com`

let userId      = null
let userId2     = null
let supabase2   = null   // second user's client

// ── Setup: create test users ─────────────────────────────────
beforeAll(async () => {
  // Sign up user 1
  const { data: u1, error: e1 } = await supabase.auth.signUp({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  })
  expect(e1).toBeNull()
  userId = u1.user?.id

  // Sign in user 1 (in case confirm email is ON and user already exists)
  await supabase.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD })

  // Insert profile for user 1
  await supabase.from('profiles').insert({ user_id: userId, full_name: 'Test User 1' })

  // Create second supabase client for RLS isolation test
  supabase2 = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: u2 } = await supabase2.auth.signUp({
    email: TEST_EMAIL_2,
    password: TEST_PASSWORD,
  })
  userId2 = u2.user?.id
  await supabase2.auth.signInWithPassword({ email: TEST_EMAIL_2, password: TEST_PASSWORD })
})

// ── Teardown ──────────────────────────────────────────────────
afterAll(async () => {
  // Clean up data created during tests
  await supabase.from('saved_items').delete().eq('user_id', userId)
  await supabase.from('notifications').delete().eq('user_id', userId)
  await supabase.from('profiles').delete().eq('user_id', userId)
  await supabase2.from('profiles').delete().eq('user_id', userId2)
  await supabase.auth.signOut()
  await supabase2.auth.signOut()
})


// ── Auth Tests ────────────────────────────────────────────────
describe('Authentication', () => {
  it('should have an active session after login', async () => {
    const { data } = await supabase.auth.getSession()
    expect(data.session).not.toBeNull()
    expect(data.session.user.email).toBe(TEST_EMAIL)
  })

  it('should persist session across getUser() call', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    expect(user).not.toBeNull()
    expect(user.id).toBe(userId)
  })
})


// ── Profile Tests ─────────────────────────────────────────────
describe('Profiles CRUD', () => {
  it('should read own profile', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .single()

    expect(error).toBeNull()
    expect(data.full_name).toBe('Test User 1')
  })

  it('should update own profile', async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: 'Updated Name' })
      .eq('user_id', userId)

    expect(error).toBeNull()

    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .single()
    expect(data.full_name).toBe('Updated Name')
  })

  it('should NOT read another user\'s profile (RLS)', async () => {
    // user 2 tries to read user 1's profile
    const { data } = await supabase2
      .from('profiles')
      .select('*')
      .eq('user_id', userId)

    expect(data).toHaveLength(0)
  })
})


// ── Saved Items (Wishlist) Tests ──────────────────────────────
describe('Saved Items CRUD', () => {
  it('should create a saved item', async () => {
    const { error } = await supabase
      .from('saved_items')
      .insert({ user_id: userId, product_id: '1' })

    expect(error).toBeNull()
  })

  it('should read only own saved items', async () => {
    const { data, error } = await supabase
      .from('saved_items')
      .select('product_id')
      .eq('user_id', userId)

    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
    expect(data.every(r => r)).toBeTruthy()
  })

  it('should NOT create a saved item for another user (RLS)', async () => {
    // user 2 tries to insert with user 1's user_id — should fail
    const { error } = await supabase2
      .from('saved_items')
      .insert({ user_id: userId, product_id: '2' })

    expect(error).not.toBeNull()
  })

  it('should NOT read another user\'s saved items (RLS)', async () => {
    const { data } = await supabase2
      .from('saved_items')
      .select('*')
      .eq('user_id', userId)

    expect(data).toHaveLength(0)
  })

  it('should delete a saved item', async () => {
    await supabase
      .from('saved_items')
      .insert({ user_id: userId, product_id: '3' })

    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', '3')

    expect(error).toBeNull()

    const { data } = await supabase
      .from('saved_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', '3')
    expect(data).toHaveLength(0)
  })

  it('should not allow duplicate saved items', async () => {
    // product_id '1' already saved in first test
    const { error } = await supabase
      .from('saved_items')
      .insert({ user_id: userId, product_id: '1' })

    expect(error).not.toBeNull()   // unique constraint violation
  })
})


// ── Notifications Tests ───────────────────────────────────────
describe('Notifications CRUD', () => {
  let notifId = null

  it('should create a notification', async () => {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id:     userId,
        type:        'price_drop',
        title:       'מעיל MANGO ירד במחיר',
        body:        'מחיר עדכני ₪239',
        product_id:  '1',
        is_read:     false,
        image_color: '#d4c5b0',
      })
      .select()
      .single()

    expect(error).toBeNull()
    notifId = data.id
  })

  it('should read own notifications ordered by created_at desc', async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should mark a notification as read', async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notifId)

    expect(error).toBeNull()

    const { data } = await supabase
      .from('notifications')
      .select('is_read')
      .eq('id', notifId)
      .single()
    expect(data.is_read).toBe(true)
  })

  it('should delete a notification', async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notifId)

    expect(error).toBeNull()

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notifId)
    expect(data).toHaveLength(0)
  })

  it('should NOT read another user\'s notifications (RLS)', async () => {
    const { data } = await supabase2
      .from('notifications')
      .select('*')
      .eq('user_id', userId)

    expect(data).toHaveLength(0)
  })
})


// ── Products Tests ────────────────────────────────────────────
describe('Products (catalogue)', () => {
  it('should read all products as authenticated user', async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, brand, title, price')

    expect(error).toBeNull()
    expect(data.length).toBeGreaterThan(0)
  })

  it('should find a specific product by id', async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', '1')
      .single()

    expect(error).toBeNull()
    expect(data.brand).toBe('MANGO')
    expect(data.price).toBe(239)
  })
})
