"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabaseClient";
import { sendWelcomeEmail } from "@/lib/email";

interface FormData {
  title: string;
  firstname: string;
  lastname: string;
  email: string;
  phone1: string;
  selectcountry: string;
  uaddress: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  occupation: string;
  ssn: string;
  marital: string;
  gender: string;
  acctype: string;
  password: string;
  country: string;
  kon_names: string;
  kon_relationshhip: string;
  kon_address: string;
  kon_city: string;
  kon_state: string;
  kon_phone: string;
  kon_email: string;
  question: string;
  answer: string;
  account_pin: string;
}

const initialForm: FormData = {
  title: "", firstname: "", lastname: "", email: "", phone1: "",
  selectcountry: "", uaddress: "", city: "", state: "", zip: "",
  dob: "", occupation: "", ssn: "", marital: "", gender: "",
  acctype: "USD SAVING", password: "", country: "",
  kon_names: "", kon_relationshhip: "", kon_address: "", kon_city: "",
  kon_state: "", kon_phone: "", kon_email: "", question: "",
  answer: "", account_pin: "",
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, [router]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      if (!form.firstname || !form.lastname || !form.email || !form.password) {
        setError("Please fill in all required fields.");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      setStep(2);
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Signup failed. Please try again.");

      const userId = authData.user.id;

      // 2. Insert profile
      const fullName = `${form.firstname} ${form.lastname}`;
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        full_name: fullName,
        title: form.title || null,
        firstname: form.firstname,
        lastname: form.lastname,
        phone: form.phone1 || null,
        country_code: form.selectcountry || null,
        nationality: form.country || null,
        address: form.uaddress || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        dob: form.dob || null,
        occupation: form.occupation || null,
        ssn: form.ssn || null,
        marital_status: form.marital || null,
        gender: form.gender || null,
        email: form.email,
        username: fullName,
      });
      if (profileError) throw new Error(profileError.message);

      // 3. Create account
      const accountNumber = "10" + Math.floor(1000000000 + Math.random() * 9000000000);
      const { error: accountError } = await supabase.from("accounts").insert({
        user_id: userId,
        account_type: form.acctype,
        account_number: accountNumber,
        balance: 0,
        interest_rate: form.acctype === "USD SAVING" ? 2.5 : 4.0,
      });
      if (accountError) throw new Error(accountError.message);

      // 4. Send welcome email
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const { ip } = await ipRes.json();
        await sendWelcomeEmail({
          name: fullName,
          email: form.email,
          accountNumber,
          ip,
        });
      } catch {
        // Email sending is non-blocking
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Nigeria",
    "Germany", "France", "Italy", "Spain", "Netherlands", "Brazil",
    "India", "China", "Japan", "South Korea", "Mexico", "Argentina",
    "South Africa", "Egypt", "Kenya", "Ghana", "Other",
  ];

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo-nobg.png"
              alt="Horizon Ridge"
              width={56}
              height={56}
              className="h-14 w-auto block dark:hidden"
            />
            <Image
              src="/images/logo.jpg"
              alt="Horizon Ridge"
              width={56}
              height={56}
              className="h-14 w-auto hidden dark:block"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-brand-dark rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 p-8">
          <h1 className="text-xl font-medium text-brand-navy dark:text-brand-light text-center mb-1">
            Create Account
          </h1>
          <p className="text-sm text-brand-gray dark:text-gray-400 text-center mb-6">
            Step {step} of 2: {step === 1 ? "Personal Information" : "Review & Submit"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-start gap-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <select
                      id="title"
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    >
                      <option value="">Select Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      id="firstname"
                      type="text"
                      value={form.firstname}
                      onChange={(e) => updateField("firstname", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      id="lastname"
                      type="text"
                      value={form.lastname}
                      onChange={(e) => updateField("lastname", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password *</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPwd ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 pr-14 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                        minLength={8}
                        maxLength={16}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-brand-sun"
                      >
                        {showPwd ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone1" className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      id="phone1"
                      type="tel"
                      value={form.phone1}
                      onChange={(e) => updateField("phone1", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="uaddress" className="block text-sm font-medium mb-1">Address</label>
                  <input
                    id="uaddress"
                    type="text"
                    value={form.uaddress}
                    onChange={(e) => updateField("uaddress", e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                    <input
                      id="state"
                      type="text"
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium mb-1">Zip Code</label>
                    <input
                      id="zip"
                      type="text"
                      value={form.zip}
                      onChange={(e) => updateField("zip", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={form.dob}
                      onChange={(e) => updateField("dob", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="occupation" className="block text-sm font-medium mb-1">Occupation</label>
                    <input
                      id="occupation"
                      type="text"
                      value={form.occupation}
                      onChange={(e) => updateField("occupation", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="ssn" className="block text-sm font-medium mb-1">SSN</label>
                    <input
                      id="ssn"
                      type="text"
                      value={form.ssn}
                      onChange={(e) => updateField("ssn", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Marital Status</label>
                    <select
                      value={form.marital}
                      onChange={(e) => updateField("marital", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => updateField("gender", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Type</label>
                    <select
                      value={form.acctype}
                      onChange={(e) => updateField("acctype", e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark px-4 py-2.5 text-sm text-brand-navy dark:text-brand-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-sun focus:border-transparent transition"
                    >
                      <option value="USD SAVING">USD SAVING</option>
                      <option value="USD CURRENT">USD CURRENT</option>
                      <option value="MONEY MARKET">MONEY MARKET</option>
                      <option value="IRA">IRA</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm space-y-2">
                  <h3 className="font-medium text-brand-navy dark:text-brand-light">Review your information</h3>
                  <div className="grid grid-cols-2 gap-2 text-brand-gray dark:text-gray-300">
                    <span>Name: {form.title} {form.firstname} {form.lastname}</span>
                    <span>Email: {form.email}</span>
                    <span>Phone: {form.phone1 || "-"}</span>
                    <span>Account Type: {form.acctype}</span>
                    <span>Address: {form.uaddress || "-"}</span>
                    <span>City: {form.city || "-"}, {form.state || "-"} {form.zip || "-"}</span>
                    <span>DOB: {form.dob || "-"}</span>
                    <span>Occupation: {form.occupation || "-"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="rounded border-gray-300 text-brand-sun focus:ring-brand-sun"
                  />
                  <label htmlFor="terms" className="text-sm text-brand-gray dark:text-gray-400">
                    I accept the{" "}
                    <Link href="/terms" className="text-brand-sun hover:underline">terms</Link> and{" "}
                    <Link href="/privacy" className="text-brand-sun hover:underline">privacy policy</Link>
                  </label>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-brand-gray dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`${step === 1 ? "w-full" : "flex-1"} py-2.5 rounded-lg bg-brand-sun text-white font-medium text-sm shadow-sm hover:bg-brand-navy transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin" />
                    Creating account...
                  </span>
                ) : step === 1 ? (
                  "Continue"
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-sm text-brand-gray dark:text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-sun font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
