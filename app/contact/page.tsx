"use client";

import Header from ".././components/layouts/Header";
import FeatureHighlightsFlow from ".././components/FeatureHighlightsFlow";
import HeroMini from ".././components/HeroMini";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black w-full">
      <Header />
      <main className="w-full pt-16 space-y-12">
        {/* HeroMini */}
        <HeroMini />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-sky-900 text-center sm:text-left">
            お問い合わせ
          </h1>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            ご質問やご要望がある場合は、以下のフォームからご連絡ください。
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">お名前</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-base sm:text-lg break-words"
                placeholder="山田 太郎"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">メールアドレス</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 text-base sm:text-lg break-words"
                placeholder="example@mail.com"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">お問い合わせ内容</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 text-base sm:text-lg break-words"
                rows={5}
                placeholder="内容を入力してください"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition shadow-md"
            >
              送信
            </button>
          </form>
        </section>

        <FeatureHighlightsFlow />
      </main>
    </div>
  );
}
