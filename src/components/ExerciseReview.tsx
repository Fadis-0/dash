import React, { useState } from "react";
import { Play, Pause, CheckCircle2, AlertCircle, Award } from "lucide-react";

export interface ExerciseAttempt {
  id: string;
  kidId: string;
  kidName: string;
  gameType: "letters" | "balloon" | "candles" | "questions";
  exerciseName: string;
  targetWord?: string;
  arabicPrompt?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  audioUrl?: string;
  score?: number;
  therapistNotes?: string;
}

interface ExerciseReviewProps {
  attempts: ExerciseAttempt[];
  onReviewSubmit: (attemptId: string, status: "approved" | "rejected") => void;
}

export const ExerciseReview: React.FC<ExerciseReviewProps> = ({ attempts, onReviewSubmit }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setTimeout(() => {
        setPlayingId(current => current === id ? null : current);
      }, 3000);
    }
  };

  const handleNotesChange = (attemptId: string, note: string) => {
    setSelectedNotes(prev => ({
      ...prev,
      [attemptId]: note
    }));
  };

  return (
    <div className="space-y-6 select-none font-body text-right" dir="rtl">
      <h3 className="text-lg font-semibold text-tk-text">تصحيح التمارين الصوتية</h3>

      <div className="grid gap-6">
        {attempts.length === 0 ? (
          <div className="bg-white border-2 border-tk-border border-dashed rounded-2xl p-12 text-center">
            <Award className="mx-auto text-tk-textMuted mb-4" size={48} />
            <h3 className="font-semibold text-lg text-tk-text mb-1">لا توجد تمارين معلقة</h3>
            <p className="text-sm text-tk-textSecondary">تم تصحيح ومراجعة جميع التسجيلات الصوتية للأطفال بنجاح!</p>
          </div>
        ) : (
          attempts.map((attempt) => {
            const isPlaying = playingId === attempt.id;
            const currentNotes = selectedNotes[attempt.id] ?? attempt.therapistNotes ?? "";

            return (
              <div
                key={attempt.id}
                className="bg-white border-2 border-tk-border rounded-2xl p-6 shadow-neo hover:shadow-lg hover:border-tk-blue transition-all duration-200"
              >
                {/* Header with Kid Info and Game Type */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-tk-border">
                  <div className="flex items-center gap-3 md:flex-row-reverse">
                    <div className="w-12 h-12 rounded-full bg-tk-greenLight text-tk-green flex items-center justify-center font-bold text-lg">
                      {attempt.kidName.charAt(0)}
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-base text-tk-text">{attempt.kidName}</h4>
                      <p className="text-xs text-tk-textSecondary font-medium">
                        {new Date(attempt.submittedAt).toLocaleDateString("ar")}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${attempt.gameType === "letters" ? "bg-tk-blueLight text-tk-blue" :
                    attempt.gameType === "balloon" ? "bg-tk-redLight text-tk-red" : "bg-tk-purpleLight text-tk-purple"
                    }`}>
                    {attempt.gameType === "letters" ? "🔤 لعبة الحروف" :
                      attempt.gameType === "balloon" ? "💨 لعبة النفس" : "❓ الأسئلة التفاعلية"}
                  </span>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Exercise & Audio */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-tk-textSecondary uppercase mb-1">التمرين المستهدف</p>
                      <h3 className="font-semibold text-base text-tk-text">{attempt.exerciseName}</h3>
                    </div>

                    {attempt.arabicPrompt && (
                      <div className="bg-tk-greenLight/50 border-2 border-tk-green rounded-xl p-4">
                        <p className="text-xs font-bold text-tk-greenDark mb-2">النطق المستهدف</p>
                        <p className="text-2xl font-bold text-tk-green font-display">{attempt.arabicPrompt}</p>
                      </div>
                    )}

                    {/* Audio Player */}
                    {attempt.audioUrl && (
                      <div className="bg-tk-background border-2 border-tk-border rounded-2xl p-4">
                        <button
                          onClick={() => togglePlay(attempt.id)}
                          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${isPlaying ? "bg-tk-green/10" : "hover:bg-tk-greenLight/30"
                            }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${isPlaying ? "bg-tk-red shadow-neoRed" : "bg-tk-green shadow-neoGreen"
                              } button-neo`}
                          >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} className="mr-0.5" />}
                          </div>
                          <div className="flex-1 text-right">
                            <div className="h-1.5 bg-tk-border rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-tk-green ${isPlaying ? "w-full transition-all duration-3000 linear" : "w-0"}`}
                              />
                            </div>
                            <p className="text-xs font-bold text-tk-textSecondary mt-1">
                              {isPlaying ? "⏸ جاري التشغيل..." : "▶ اضغط للاستماع"}
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Feedback & Actions */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold text-tk-textSecondary uppercase block mb-2">
                        التقييم والملاحظات
                      </label>
                      <textarea
                        placeholder="مثال: نطق جميل!✨"
                        rows={3}
                        value={currentNotes}
                        onChange={(e) => handleNotesChange(attempt.id, e.target.value)}
                        className="w-full p-3 bg-tk-background border-2 border-tk-border rounded-xl text-sm font-semibold focus:outline-none focus:border-tk-green text-right resize-none"
                      />
                    </div>

                    <div className="flex gap-2 flex-col">
                      <button
                        onClick={() => onReviewSubmit(attempt.id, "approved")}
                        className="w-full py-2.5 bg-tk-green border-2 border-tk-greenDark text-white font-bold text-sm rounded-xl button-neo shadow-neoGreen flex items-center justify-center gap-1.5 hover:translate-y-[-2px] transition-transform"
                      >
                        <CheckCircle2 size={16} />
                        <span>موافق ✓</span>
                      </button>
                      <button
                        onClick={() => onReviewSubmit(attempt.id, "rejected")}
                        className="w-full py-2.5 bg-tk-redLight border-2 border-tk-red text-tk-red font-bold text-sm rounded-xl button-neo hover:translate-y-[-2px] transition-transform flex items-center justify-center gap-1.5"
                      >
                        <AlertCircle size={16} />
                        <span>بحاجة تدريب</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
