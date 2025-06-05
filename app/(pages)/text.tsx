<div className="max-w-6xl mx-auto px-4 py-6">
  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    {/* Main Content */}
    <div className="lg:col-span-3 space-y-6">
      {/* Ask Question Card */}
      <Postquestion />

      {/* Questions Feed */}
      <Questionsfeed />
    </div>

    {/* Sidebar */}
    <Topicsbar />
  </div>
</div>;
