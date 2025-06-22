import React from 'react'
import Navbar from '@/components/Navbar'
import TopicQuestionFeed from '@/components/question/TopicQuestionFeed'
const page = () => {
  return (
    <div className="max-w-100dvw max-h-100dvh">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <TopicQuestionFeed />
      </div>
    </div>
  )
}

export default page
