function App() {
  return (
    <>
      <div className="flex flex-col gap-6 min-h-screen items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.2s]"></div>
          <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.4s]"></div>
        </div>
        {/* <div className="text-white text-3xl">Loading</div> */}
      </div>
    </>
  )
}

export default App
