import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { Sidebar } from "./components/Sidebar";
import { ProgressChart } from "./components/ProgressChart";
import { ExerciseReview, ExerciseAttempt } from "./components/ExerciseReview";
import { LandingPage } from "./components/LandingPage";
import { createClient } from "@supabase/supabase-js";
import logoImage from "./splash-logo.jpeg";
import {
  Users,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles,
  Search,
  UserPlus,
  Award,
  CircleCheck,
  BrainCircuit,
  MessageSquare,
  X
} from "lucide-react";

interface KidProfile {
  id: string;
  name: string;
  age_range: string;
  gender: string;
  streak_days: number;
  last_practice_date: string | null;
  levels: {
    letters: number;
    balloon: number;
    candles: number;
    colors: number;
    sizes: number;
    places: number;
    interactive: number;
    video: number;
  };
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [orthophonist, setOrthophonist] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [kids, setKids] = useState<KidProfile[]>([]);
  const [selectedKid, setSelectedKid] = useState<KidProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "patients" | "corrections" | "reports">("overview");

  // Auth form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Signup fields
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [city, setCity] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Add Patient Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"link" | "create">("link"); // link: link existing kid, create: register parent + kid
  const [newKidName, setNewKidName] = useState("");
  const [newKidGender, setNewKidGender] = useState("male");
  const [newKidAge, setNewKidAge] = useState("3to5");
  const [parentPhoneQuery, setParentPhoneQuery] = useState(""); // for linking existing

  // Registration of parent fields
  const [parentEmail, setParentEmail] = useState("");
  const [parentPassword, setParentPassword] = useState("");
  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Exercise Attempts list (Simulated/Synced data)
  const [attempts, setAttempts] = useState<ExerciseAttempt[]>([]);

  // 1. Monitor auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch orthophonist info when session changes
  useEffect(() => {
    if (!session) {
      setOrthophonist(null);
      setProfile(null);
      setKids([]);
      return;
    }

    const fetchOrthophonistInfo = async () => {
      const { data: profData, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profErr || !profData) {
        setAuthError("فشل في تحميل حساب أخصائي النطق.");
        await supabase.auth.signOut();
        return;
      }

      if (profData.role !== "orthophonist") {
        setAuthError("عذراً، هذا الحساب ليس مسجلاً كأخصائي نطق وتخاطب.");
        await supabase.auth.signOut();
        return;
      }

      setProfile(profData);

      const { data: orthoData, error: orthoErr } = await supabase
        .from("orthophonists")
        .select("*")
        .eq("profile_id", session.user.id)
        .single();

      if (orthoErr) {
        const { data: newOrtho, error: createErr } = await supabase
          .from("orthophonists")
          .insert({
            profile_id: session.user.id,
            clinic_name: "عيادتي الخاصة",
            city: "الدار البيضاء"
          })
          .select()
          .single();

        if (!createErr && newOrtho) {
          setOrthophonist(newOrtho);
        }
      } else {
        setOrthophonist(orthoData);
      }
    };

    fetchOrthophonistInfo();
  }, [session]);

  // 3. Load kids when orthophonist id is set
  useEffect(() => {
    if (!orthophonist) return;
    loadKids();
  }, [orthophonist]);

  const loadKids = async () => {
    const { data: kidsData, error: kidsErr } = await supabase
      .from("kids")
      .select("*")
      .eq("orthophonist_id", orthophonist.id);

    if (kidsErr || !kidsData) {
      console.error("Error loading kids", kidsErr);
      return;
    }

    const kidsWithStats: KidProfile[] = [];

    for (const kid of kidsData) {
      const { data: statsData } = await supabase
        .from("kid_stats")
        .select("*")
        .eq("kid_id", kid.id)
        .single();

      kidsWithStats.push({
        id: kid.id,
        name: kid.name,
        age_range: kid.age_range || "3to5",
        gender: kid.gender || "male",
        streak_days: statsData?.streak_days ?? 0,
        last_practice_date: statsData?.last_practice_date ?? null,
        levels: {
          letters: statsData?.letters_game_level ?? 0,
          balloon: statsData?.balloon_game_level ?? 0,
          candles: statsData?.candles_game_level ?? 0,
          colors: statsData?.questions_colors_level ?? 0,
          sizes: statsData?.questions_sizes_level ?? 0,
          places: statsData?.questions_places_level ?? 0,
          interactive: statsData?.questions_interactive_level ?? 0,
          video: statsData?.video_questions_game_level ?? 0,
        }
      });
    }

    setKids(kidsWithStats);

    // Populate simulated exercises for these kids
    const simulatedAttempts: ExerciseAttempt[] = [];
    kidsWithStats.forEach((kid, i) => {
      simulatedAttempts.push({
        id: `att-1-${kid.id}`,
        kidId: kid.id,
        kidName: kid.name,
        gameType: "letters",
        exerciseName: "نطق حرف الباء ",
        targetWord: "باب",
        arabicPrompt: "ب",
        status: "pending",
        submittedAt: new Date(Date.now() - i * 3600000 - 1800000).toISOString(),
        audioUrl: "simulated_audio.wav"
      });
      simulatedAttempts.push({
        id: `att-2-${kid.id}`,
        kidId: kid.id,
        kidName: kid.name,
        gameType: "questions",
        exerciseName: "الأسئلة التفاعلية: أين القطة؟",
        targetWord: "تحت الطاولة",
        arabicPrompt: "القطة تحت الطاولة",
        status: "pending",
        submittedAt: new Date(Date.now() - i * 7200000 - 3600000).toISOString(),
        audioUrl: "simulated_audio.wav"

      });
    });
    setAttempts(simulatedAttempts);
  };

  // 4. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  // 4b. Handle SignUp for Orthophonist
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
      });

      if (signUpErr || !signUpData.user) {
        throw new Error(signUpErr?.message || "فشلت عملية إنشاء الحساب");
      }

      const userId = signUpData.user.id;

      // Insert profile details
      const { error: profileErr } = await supabase.from("profiles").insert({
        id: userId,
        role: "orthophonist",
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      });

      if (profileErr) throw profileErr;

      // Insert orthophonist specific fields
      const { error: orthoErr } = await supabase.from("orthophonists").insert({
        profile_id: userId,
        clinic_name: clinicName,
        license_number: licenseNumber,
        city: city,
        professional_email: signUpEmail,
      });

      if (orthoErr) throw orthoErr;

      setAuthError("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
      setIsSignUp(false);
      // Clean up fields
      setSignUpEmail("");
      setSignUpPassword("");
      setFirstName("");
      setLastName("");
      setPhone("");
      setClinicName("");
      setLicenseNumber("");
      setCity("");
    } catch (err: any) {
      setAuthError(err.message || "فشلت عملية إنشاء الحساب");
    } finally {
      setAuthLoading(false);
    }
  };

  // 5. Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 6. Handle Adding or Registering Parent & Kid
  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);

    try {
      let targetParentId = "";

      if (modalMode === "link") {
        // Mode 1: Search parent by phone number
        const { data: parentProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("phone", parentPhoneQuery)
          .limit(1);

        if (parentProfile && parentProfile.length > 0) {
          targetParentId = parentProfile[0].id;
        } else {
          throw new Error("لم يتم العثور على أي ولي أمر مسجل بهذا الرقم. يرجى اختيار 'إنشاء حساب كامل لولي الأمر والطفل'");
        }
      } else {
        // Mode 2: Register Parent account & Kid
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Create temporary client with auth state persistence OFF to avoid logging the therapist out
        const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          }
        });

        // Sign up parent
        const { data: parentAuth, error: parentAuthErr } = await tempClient.auth.signUp({
          email: parentEmail,
          password: parentPassword
        });

        if (parentAuthErr || !parentAuth.user) {
          throw new Error(parentAuthErr?.message || "فشل تسجيل ولي الأمر في خادم الهوية");
        }

        targetParentId = parentAuth.user.id;

        // Insert parent profile
        const { error: parentProfileErr } = await supabase.from("profiles").insert({
          id: targetParentId,
          role: "parent",
          first_name: parentFirstName,
          last_name: parentLastName,
          phone: parentPhone,
        });

        if (parentProfileErr) {
          throw new Error("فشل حفظ الملف الشخصي لولي الأمر: " + parentProfileErr.message);
        }
      }

      // Insert kid
      const { data: newKid, error: kidErr } = await supabase
        .from("kids")
        .insert({
          parent_id: targetParentId,
          name: newKidName,
          age_range: newKidAge,
          gender: newKidGender,
          orthophonist_id: orthophonist.id
        })
        .select()
        .single();

      if (kidErr || !newKid) {
        throw new Error(kidErr?.message || "فشل تسجيل الطفل");
      }

      // Initialize stats
      await supabase.from("kid_stats").insert({
        kid_id: newKid.id,
        streak_days: 0,
        letters_game_level: 1,
        video_questions_game_level: 1
      });

      setShowAddModal(false);
      setNewKidName("");
      setParentPhoneQuery("");
      setParentEmail("");
      setParentPassword("");
      setParentFirstName("");
      setParentLastName("");
      setParentPhone("");
      loadKids();
    } catch (err: any) {
      setAddError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setAddLoading(false);
    }
  };

  // 7. Handle exercise reviews
  const handleReviewSubmit = (attemptId: string, status: "approved" | "rejected") => {
    setAttempts(current => current.filter(att => att.id !== attemptId));
    const targetAttempt = attempts.find(att => att.id === attemptId);
    if (targetAttempt && status === "approved") {
      setKids(prevKids =>
        prevKids.map(k => {
          if (k.id === targetAttempt.kidId) {
            return {
              ...k,
              streak_days: k.streak_days + 1,
              levels: {
                ...k.levels,
                letters: targetAttempt.gameType === "letters" ? k.levels.letters + 1 : k.levels.letters,
                interactive: targetAttempt.gameType === "questions" ? k.levels.interactive + 1 : k.levels.interactive,
              }
            };
          }
          return k;
        })
      );
    }
  };

  const filteredKids = kids.filter(k =>
    k.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not authenticated, render Landing Page with Auth Modal
  if (!session) {
    return (
      <>
        <LandingPage onLoginClick={() => setShowAuthForm(true)} />

        {/* Auth Modal */}
        {showAuthForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50" dir="rtl">
            <div className="w-full max-w-lg bg-white border-2 border-tk-border rounded-3xl p-8 shadow-neo relative animate-in fade-in slide-in-from-bottom-4">
              <button
                onClick={() => {
                  setShowAuthForm(false);
                  setIsSignUp(false);
                  setAuthError(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-tk-background rounded-lg transition-colors"
              >
                <X size={20} className="text-tk-textSecondary" />
              </button>

              <div className="flex flex-col items-center mb-6 mt-2">
                <div className="w-16 h-16 rounded-2xl bg-white border-4 border-tk-green flex items-center justify-center shadow-neoGreen mb-3 overflow-hidden">
                  <img src={logoImage} className="w-full h-full object-cover" alt="Talky Kids Logo" />
                </div>
                <h1 className="text-xl font-display font-bold text-tk-text">Talky Kids</h1>
                <p className="text-xs text-tk-textSecondary font-bold mt-1">بوابة أخصائي النطق</p>
              </div>

              {authError && (
                <div className={`p-4 mb-4 border-2 rounded-xl text-sm font-semibold text-center ${authError.includes("نجاح") ? "bg-tk-greenLight border-tk-green text-tk-greenDark" : "bg-tk-redLight border-tk-red text-tk-red"
                  }`}>
                  {authError}
                </div>
              )}

              {!isSignUp ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <h2 className="text-lg font-bold text-tk-text text-center">تسجيل الدخول إلى البوابة</h2>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-tk-textSecondary uppercase block">البريد الإلكتروني </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@clinic.com"
                      className="w-full px-4 py-2.5 bg-tk-background border-2 border-tk-border rounded-xl text-sm font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="space-y-1 text-right">
                    <label className="text-xs font-bold text-tk-textSecondary uppercase block">كلمة المرور</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-tk-background border-2 border-tk-border rounded-xl text-sm font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-sm rounded-xl button-neo shadow-neoGreen flex items-center justify-center"
                  >
                    {authLoading ? "جاري التحقق..." : "تسجيل الدخول"}
                  </button>

                  <p className="text-xs text-center text-tk-textSecondary font-semibold mt-4">
                    جديد على المنصة؟{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true);
                        setAuthError(null);
                      }}
                      className="text-tk-blue hover:underline font-bold"
                    >
                      إنشاء حساب أخصائي نطق جديد
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-3 max-h-[70vh] overflow-y-auto pl-1 text-right">
                  <h2 className="text-lg font-bold text-tk-text text-center">إنشاء حساب أخصائي جديد</h2>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">اللقب</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="عياد"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">الاسم</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="فادي"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">رقم الهاتف</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0674085020"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">المدينة</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="عنابة"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">اسم العيادة / المركز</label>
                      <input
                        type="text"
                        required
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        placeholder="عيادة التميز"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">رقم التعريف الوطني </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="xxx-xxx-xxx-xxx-xxxx"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="doctor@clinic.com"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">كلمة المرور</label>
                    <input
                      type="password"
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 bg-tk-blue border-2 border-tk-blueDark text-white font-bold text-sm rounded-xl button-neo shadow-neoBlue flex items-center justify-center"
                  >
                    {authLoading ? "جاري التسجيل..." : "إنشاء حساب"}
                  </button>

                  <p className="text-xs text-center text-tk-textSecondary font-semibold mt-3">
                    لديك حساب بالفعل؟{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false);
                        setAuthError(null);
                      }}
                      className="text-tk-green hover:underline font-bold"
                    >
                      تسجيل الدخول
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-tk-background flex font-body" dir="rtl">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedKid(null);
        }}
        onLogout={handleLogout}
        orthophonistName={`د. ${profile?.first_name || ""} ${profile?.last_name || "المعالج"}`}
        clinicName={orthophonist?.clinic_name || "مركز التخاطب"}
      />

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-10 max-h-screen text-right">
        {activeTab === "overview" && (
          <div className="space-y-8 select-none">
            {/* Header banner */}
            <div className="flex flex-row justify-between items-center bg-white border-2 border-tk-border p-6 rounded-2xl shadow-neo">
              <div>
                <h1 className="text-3xl font-display font-bold text-tk-text flex flex-row items-center gap-2">
                  مرحباً بك، د. {profile?.last_name || "المعالج"}! <Sparkles className="text-tk-orange animate-bounce" size={24} />
                </h1>
                <p className="text-sm text-tk-textSecondary font-bold mt-1">إليك نظرة سريعة على تقدم الأطفال وجلسات اليوم.</p>
              </div>
              <div className="flex items-center gap-2 bg-tk-blueLight border border-tk-blue rounded-xl px-4 py-2 text-tk-blue text-sm font-bold">
                <Calendar size={16} />
                <span>{new Date().toLocaleDateString("ar", { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo flex flex-row items-center justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-tk-blueLight text-tk-blue flex items-center justify-center">
                  <Users size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-tk-text">{kids.length}</h3>
                  <p className="text-xs text-tk-textSecondary font-bold">الأطفال المسجلين</p>
                </div>
              </div>

              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo flex flex-row items-center justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-tk-greenLight text-tk-green flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-tk-text">
                    {kids.length > 0 ? Math.round(kids.reduce((acc, k) => acc + k.streak_days, 0) / kids.length) : 0} أيام
                  </h3>
                  <p className="text-xs text-tk-textSecondary font-bold">متوسط نشاط الأطفال</p>
                </div>
              </div>

              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo flex flex-row items-center justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-tk-purpleLight text-tk-purple flex items-center justify-center">
                  <Award size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-bold text-tk-text">{attempts.length}</h3>
                  <p className="text-xs text-tk-textSecondary font-bold">تسجيلات صوتية تحتاج لمراجعتك</p>
                </div>
              </div>
            </div>

            {/* Quick patient list & chart summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo flex flex-col text-right">
                <div className="flex justify-between items-center mb-6 flex-row">
                  <h3 className="font-display font-bold text-lg text-tk-text">نشاط الأطفال الأخير</h3>
                  <button onClick={() => setActiveTab("patients")} className="text-xs font-bold text-tk-blue flex items-center gap-0.5 hover:underline">
                    <span>عرض الكل</span>
                    <ChevronRight size={14} className="rotate-180" />
                  </button>
                </div>

                <div className="divide-y divide-tk-border mt-4 flex-grow">
                  {kids.slice(0, 4).map((kid) => (
                    <div key={kid.id} className="py-3 mx-8 shadow px-6 rounded-xl flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-tk-text">
                          {kid.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-tk-text">{kid.name}</h4>
                          <p className="text-xs text-tk-textSecondary font-medium">عمر {kid.age_range === "3to5" ? "3 - 5 سنوات" : "5 - 9 سنوات"}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-bold text-tk-green">نشاط {kid.streak_days} أيام 🔥</span>
                      </div>
                    </div>
                  ))}
                  {kids.length === 0 && (
                    <div className="text-center py-12 text-tk-textSecondary font-medium">
                      لا يوجد أطفال مسجلين تحت إشرافك بعد. اذهب إلى قائمة المرضى لإضافتهم.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Chart */}
              <ProgressChart
                levels={[
                  { label: "لعبة الحروف", value: kids.reduce((acc, k) => acc + k.levels.letters, 0) / (kids.length || 1), max: 10, color: "#1CB0F6" },
                  { label: "ألعاب النفس والنفخ", value: kids.reduce((acc, k) => acc + (k.levels.balloon + k.levels.candles) / 2, 0) / (kids.length || 1), max: 10, color: "#FF4B4B" },
                  { label: "الألوان والأحجام", value: kids.reduce((acc, k) => acc + (k.levels.colors + k.levels.sizes) / 2, 0) / (kids.length || 1), max: 10, color: "#FF9600" },
                  { label: "الأسئلة التفاعلية", value: kids.reduce((acc, k) => acc + k.levels.interactive, 0) / (kids.length || 1), max: 10, color: "#CE82FF" },
                ]}
              />
            </div>
          </div>
        )}

        {activeTab === "patients" && !selectedKid && (
          <div className="space-y-6 select-none text-right">
            <div className="flex justify-between items-center flex-row">
              <div>
                <h2 className="text-2xl font-display font-bold text-tk-text">الأطفال والمرضى</h2>
                <p className="text-sm text-tk-textSecondary">قم بإضافة الأطفال وإنشاء حسابات لأولياء الأمور لتتبع تقدّمهم.</p>
              </div>
              <button
                onClick={() => {
                  setModalMode("link");
                  setShowAddModal(true);
                }}
                className="px-5 py-3 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-sm rounded-xl flex items-center gap-2 button-neo shadow-neoGreen"
              >
                <UserPlus size={18} />
                <span>إضافة وتسجيل مريض جديد</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative mx-64 my-16">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مريض بالاسم..."
                className="w-full pl-4 pr-12 py-3.5 bg-white border-2 border-tk-border rounded-xl text-sm font-semibold focus:outline-none focus:border-tk-blue text-right"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-tk-textMuted" size={20} />
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredKids.map((kid) => (
                <div
                  key={kid.id}
                  onClick={() => setSelectedKid(kid)}
                  className="bg-white border-2 border-tk-border hover:border-tk-blue rounded-2xl p-6 shadow-neo hover:translate-y-[-2px] transition-all duration-150 cursor-pointer text-right"
                >
                  <div className="flex flex-row-reverse justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-tk-background flex items-center justify-center text-lg font-bold text-tk-text">
                      {kid.name.charAt(0)}
                    </div>
                    <span className="px-3 py-1 bg-tk-greenLight border border-tk-green text-tk-greenDark text-xs font-bold rounded-full">
                      حماس {kid.streak_days} أيام 🔥
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-tk-text">{kid.name}</h3>
                  <div className="mt-2 text-xs font-semibold text-tk-textSecondary space-y-1">
                    <p>الفئة العمرية: {kid.age_range === "3to5" ? "3 - 5 سنوات" : "5 - 9 سنوات"}</p>
                    <p>الجنس: {kid.gender === "male" ? "ولد" : "بنت"}</p>
                    <p>تاريخ التدريب الأخير: {kid.last_practice_date ? new Date(kid.last_practice_date).toLocaleDateString("ar-EG") : "لم يبدأ بعد"}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-tk-border flex flex-row justify-between items-center text-xs font-bold text-tk-blue">
                    <span>عرض تفاصيل التقدم ومستويات اللعب</span>
                    <ChevronRight size={14} className="rotate-180" />
                  </div>
                </div>
              ))}

              {filteredKids.length === 0 && (
                <div className="col-span-full bg-white border-2 border-tk-border border-dashed rounded-2xl p-12 text-center">
                  <Users className="mx-auto text-tk-textMuted mb-2" size={36} />
                  <p className="font-semibold text-tk-textSecondary">لا يوجد أطفال مطابقين لبحثك</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Kid detail screen */}
        {activeTab === "patients" && selectedKid && (
          <div className="space-y-6 select-none animate-fadeIn text-left">
            <button
              onClick={() => setSelectedKid(null)}
              className="text-sm font-bold text-tk-blue hover:underline mb-2 flex items-center gap-1"
            >
              العودة لقائمة المرضى ←
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Card */}
              <div className="w-full md:w-80 bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo space-y-4 text-right">
                <div className="flex flex-row items-center gap-4 justify-start">
                  <div className="w-14 h-14 rounded-full bg-tk-blueLight flex items-center justify-center text-xl font-bold text-tk-blue">
                    {selectedKid.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-tk-text">{selectedKid.name}</h2>
                    <p className="text-xs text-tk-textSecondary font-bold">معرف المريض: {selectedKid.id.slice(0, 8)}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm font-semibold pt-4 border-t border-tk-border">
                  <div className="flex flex-row justify-between">
                    <span className="text-tk-textSecondary">الفئة العمرية:</span>
                    <span className="text-tk-text">{selectedKid.age_range === "3to5" ? "3 - 5 سنوات" : "5 - 9 سنوات"}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="text-tk-textSecondary">الجنس:</span>
                    <span className="text-tk-text">{selectedKid.gender === "male" ? "ولد" : "بنت"}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="text-tk-textSecondary">أيام الحماس:</span>
                    <span className="text-tk-green font-bold">{selectedKid.streak_days} أيام</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="text-tk-textSecondary">آخر نشاط:</span>
                    <span className="text-tk-text">{selectedKid.last_practice_date ? new Date(selectedKid.last_practice_date).toLocaleDateString("ar-EG") : "لا يوجد"}</span>
                  </div>
                </div>
              </div>

              {/* Progress Chart details */}
              <div className="flex-grow w-full">
                <ProgressChart
                  levels={[
                    { label: "لعبة الحروف", value: selectedKid.levels.letters, max: 10, color: "#1CB0F6" },
                    { label: "لعبة البالون (التنفس)", value: selectedKid.levels.balloon, max: 10, color: "#FF4B4B" },
                    { label: "لعبة الشموع (التنفس)", value: selectedKid.levels.candles, max: 10, color: "#FF9600" },
                    { label: "أسئلة الألوان", value: selectedKid.levels.colors, max: 10, color: "#CE82FF" },
                    { label: "أسئلة الأحجام", value: selectedKid.levels.sizes, max: 10, color: "#58CC02" },
                    { label: "أسئلة الأماكن", value: selectedKid.levels.places, max: 10, color: "#FF9600" },
                    { label: "الأسئلة التفاعلية", value: selectedKid.levels.interactive, max: 10, color: "#1CB0F6" },
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "corrections" && (
          <ExerciseReview
            attempts={attempts}
            onReviewSubmit={handleReviewSubmit}
          />
        )}

        {activeTab === "reports" && (
          <div className="space-y-8 select-none text-مثبف">
            <div>
              <h2 className="text-2xl font-display font-bold text-tk-text">التقارير والإحصائيات العامة</h2>
              <p className="text-sm text-tk-textSecondary">ملخص حول سلوك وممارسة النطق لجميع المرضى المسجلين لديك.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo space-y-4">
                <h3 className="font-display font-bold text-lg text-tk-text mb-4 text-right">إرشادات وحالات مخصصة</h3>
                <div className="space-y-4">
                  <div className="flex flex-row items-start gap-3 p-3 bg-tk-greenLight/30 border border-tk-green/30 rounded-xl">
                    <CircleCheck className="text-tk-green mt-0.5" size={18} />
                    <div className="text-right">
                      <h4 className="font-bold text-sm text-tk-text">نشاط مستقر هذا الأسبوع</h4>
                      <p className="text-xs text-tk-textSecondary">يحافظ الأطفال على معدل نشاط يبلغ 4.2 أيام أسبوعياً من الممارسة المنزلية.</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-start gap-3 p-3 bg-tk-blueLight/30 border border-tk-blue/30 rounded-xl">
                    <BrainCircuit className="text-tk-blue mt-0.5" size={18} />
                    <div className="text-right">
                      <h4 className="font-bold text-sm text-tk-text">توصية بتغيير مستوى صعوبة الحروف</h4>
                      <p className="text-xs text-tk-textSecondary">تجاوز 3 أطفال المستوى الثامن في لعبة النطق والحروف، نوصي بمراجعة أدائهم ورفع مستوى الصعوبة.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo flex flex-col justify-center items-center text-center">
                <MessageSquare className="text-tk-purple mb-3" size={32} />
                <h3 className="font-display font-bold text-lg text-tk-text">تصدير تقارير الأداء الأسبوعية</h3>
                <p className="text-sm text-tk-textSecondary max-w-sm mt-1">تصدير ورقة تقدم الأطفال ومشاركة الملاحظات مباشرة مع أولياء الأمور عبر الواتساب أو البريد.</p>
                <button className="mt-4 px-5 py-2.5 bg-tk-purple border-2 border-tk-purple/80 text-white font-bold text-xs rounded-xl button-neo shadow-neo">
                  تحميل تقارير المتابعة
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Patient / Parent SignUp Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50 select-none font-body" dir="rtl">
          <div className="w-full max-w-lg bg-white border-2 border-tk-border rounded-3xl p-6 shadow-neo text-right">
            <h3 className="text-xl font-display font-bold text-tk-text mb-2">تسجيل وإضافة طفل جديد</h3>

            {/* Mode selection tabs */}
            <div className="flex border-b border-tk-border mb-4">
              <button
                type="button"
                onClick={() => {
                  setModalMode("link");
                  setAddError(null);
                }}
                className={`flex-1 py-2 font-bold text-sm ${modalMode === "link" ? "border-b-2 border-tk-green text-tk-green" : "text-tk-textSecondary"}`}
              >
                ربط طفل بحساب هاتف موجود
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalMode("create");
                  setAddError(null);
                }}
                className={`flex-1 py-2 font-bold text-sm ${modalMode === "create" ? "border-b-2 border-tk-green text-tk-green" : "text-tk-textSecondary"}`}
              >
                إنشاء حساب كامل لولي الأمر والطفل
              </button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4 max-h-[70vh] overflow-y-auto pl-1">
              {addError && (
                <div className="p-3 bg-tk-redLight border border-tk-red text-tk-red text-xs font-bold rounded-xl text-center">
                  {addError}
                </div>
              )}

              {/* Kid Fields */}
              <div className="border-b border-tk-border pb-3">
                <h4 className="font-bold text-xs text-tk-blue mb-2">بيانات الطفل (المريض)</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">اسم الطفل الأول</label>
                    <input
                      type="text"
                      required
                      value={newKidName}
                      onChange={(e) => setNewKidName(e.target.value)}
                      placeholder="مثال: يوسف"
                      className="w-full px-4 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">الجنس</label>
                      <select
                        value={newKidGender}
                        onChange={(e) => setNewKidGender(e.target.value)}
                        className="w-full px-4 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      >
                        <option value="male">ولد</option>
                        <option value="female">بنت</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">فئة العمر</label>
                      <select
                        value={newKidAge}
                        onChange={(e) => setNewKidAge(e.target.value)}
                        className="w-full px-4 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      >
                        <option value="3to5">3 – 5 سنوات</option>
                        <option value="5to9">5 – 9 سنوات</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Fields depending on selection */}
              {modalMode === "link" ? (
                <div>
                  <h4 className="font-bold text-xs text-tk-blue mb-2">ربط بحساب ولي أمر</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">رقم هاتف ولي الأمر (المسجل بالتطبيق)</label>
                    <input
                      type="text"
                      required
                      value={parentPhoneQuery}
                      onChange={(e) => setParentPhoneQuery(e.target.value)}
                      placeholder="مثال: +212 600000000"
                      className="w-full px-4 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                    <p className="text-[10px] text-tk-textMuted font-medium">سيرتبط الطفل تلقائياً بملف هاتف ولي أمره.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-tk-blue mb-2">إنشاء حساب جديد لولي الأمر</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">الاسم العائلي لولي الأمر</label>
                      <input
                        type="text"
                        required
                        value={parentLastName}
                        onChange={(e) => setParentLastName(e.target.value)}
                        placeholder="العلوي"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-tk-textSecondary block">الاسم الأول لولي الأمر</label>
                      <input
                        type="text"
                        required
                        value={parentFirstName}
                        onChange={(e) => setParentFirstName(e.target.value)}
                        placeholder="أحمد"
                        className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">رقم هاتف ولي الأمر</label>
                    <input
                      type="text"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+212 600-000000"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">البريد الإلكتروني لولي الأمر</label>
                    <input
                      type="email"
                      required
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@email.com"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-tk-textSecondary block">تعيين كلمة مرور لولي الأمر</label>
                    <input
                      type="password"
                      required
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      placeholder="6 أحرف على الأقل"
                      className="w-full px-3 py-2 bg-tk-background border-2 border-tk-border rounded-xl text-xs font-semibold focus:outline-none focus:border-tk-blue text-right"
                    />
                    <p className="text-[10px] text-tk-textMuted font-medium">سيستخدم ولي الأمر هذا البريد وكلمة المرور لتسجيل الدخول في تطبيق الهاتف.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-tk-border flex-row">
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 py-3 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-sm rounded-xl button-neo shadow-neoGreen"
                >
                  {addLoading ? "جاري الحفظ والإنشاء..." : "تسجيل المريض"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-white border-2 border-tk-border text-tk-textSecondary font-bold text-sm rounded-xl button-neo shadow-neo"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
