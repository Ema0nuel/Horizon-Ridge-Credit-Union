import { supabase } from '../../../utils/supabaseClient';
import { sendWelcomeEmail } from './Emailing/email';
import { getGeoLocation } from './data';

/**
 * Signup a new user, insert full profile, create account, and send welcome email.
 * @param {Object} formData - All signup form fields.
 * @param {string} ip - User's IP address.
 */
export async function signupUser(formData, ip) {
  // 1. Create user in Supabase Auth
  const {
    email,
    password,
    firstname,
    lastname,
    title,
    phone,
    country_code,
    nationality,
    address,
    city,
    state,
    zip,
    dob,
    occupation,
    ssn,
    marital_status,
    gender,
    username,
    acctype
  } = formData;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  const userId = data.user.id;

  // 2. Insert profile data (all fields as per your schema)
  const profileData = {
    id: userId,
    full_name: `${firstname} ${lastname}`,
    title: title || null,
    firstname,
    lastname,
    phone: phone || null,
    country_code: country_code || null,
    nationality: nationality || null,
    address: address || null,
    city: city || null,
    state: state || null,
    zip: zip || null,
    dob: dob || null,
    occupation: occupation || null,
    ssn: ssn || null,
    marital_status: marital_status || null,
    gender: gender || null,
    email,
    username: `${firstname} ${lastname}` || null
    // created_at will be set by default
  };

  const { error: profileError } = await supabase.from("profiles").insert(profileData);
  if (profileError) throw new Error(profileError.message);

  // 3. Create account row
  const account_number = "10" + Math.floor(1000000000 + Math.random() * 9000000000);
  const { error: accountError } = await supabase.from("accounts").insert({
    user_id: userId,
    account_type: acctype,
    account_number,
    balance: 0,
    interest_rate: acctype === "USD SAVING" ? 2.5 : 4.0
  });
  if (accountError) throw new Error(accountError.message);

  // 4. Send welcome email
  const geo = await getGeoLocation(ip);
  await sendWelcomeEmail({
    name: `${firstname} ${lastname}`,
    email,
    accountNumber: account_number,
    ip,
    geo
  });

  // 5. Redirect to authentication view
  window.location.href = "/user/auth";
}