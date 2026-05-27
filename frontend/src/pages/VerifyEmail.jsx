import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { authApi, extractError } from "../services/api";

const STATUS = { IDLE: "idle", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [message, setMessage] = useState("");
  const called = useRef(false);

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true;

    const verify = async () => {
      setStatus(STATUS.LOADING);
      try {
        await authApi.verifyEmail(token);
        setStatus(STATUS.SUCCESS);
        setMessage("ایمیل شما با موفقیت تأیید شد. اکنون می‌توانید وارد شوید.");
      } catch (err) {
        setStatus(STATUS.ERROR);
        setMessage(extractError(err, "توکن نامعتبر یا منقضی شده است."));
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 text-center" dir="rtl">

        {status === STATUS.LOADING && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-sm text-gray-600">در حال تأیید ایمیل…</p>
          </>
        )}

        {status === STATUS.SUCCESS && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">تأیید ایمیل موفق!</h2>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              ورود به حساب
            </Link>
          </>
        )}

        {status === STATUS.ERROR && (
          <>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">تأیید ناموفق</h2>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <Link
              to="/resend-verification"
              className="inline-block rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              ارسال مجدد ایمیل تأیید
            </Link>
          </>
        )}

        {status === STATUS.IDLE && (
          <p className="text-sm text-gray-500">توکن یافت نشد.</p>
        )}
      </div>
    </div>
  );
}
