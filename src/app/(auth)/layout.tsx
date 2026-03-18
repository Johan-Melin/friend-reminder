export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">💌</span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Friend Reminder</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Stay in touch with the people who matter</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">{children}</div>
      </div>
    </div>
  )
}
