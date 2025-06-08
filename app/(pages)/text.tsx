<Card className="mb-6">
  <CardContent className="p-6">
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={data?.user?.image || "/globe.svg"} />
          <AvatarFallback>{data?.user?.username}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-semibold">{data?.user?.username}</span>
            <span className="text-gray-500 text-sm">
              asked {data?.createdAt}
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-3">{data?.title}</h1>
          <p className="text-gray-700 mb-4 leading-relaxed">{data?.body}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpvoteQuestion}
                  className="flex items-center space-x-1"
                  disabled={data?.alreadyUpvoted}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>{data?.upvotes.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={data?.alreadyDownvoted}
                >
                  <ChevronDown className="w-4 h-4" />
                  <span>{data?.downvotes.length}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* <div className="flex space-x-2 mt-4">
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div> */}
        </div>
      </div>
    </div>
  </CardContent>
</Card>;

<Card>
  <CardHeader>
    <h3 className="font-semibold">Your Answer</h3>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-start space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.image || "/globe.svg"} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder="Write your answer here... You can use markdown formatting."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="min-h-[120px]"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setNewAnswer("")}>
            Cancel
          </Button>
          <Button onClick={handleSubmitAnswer} disabled={!newAnswer.trim()}>
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>;

<div className="space-y-6">
  {data?.answers.map((answer) => (
    <Card key={answer.id}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={answer.authorAvatar || "/globe.svg"} />
            <AvatarFallback>{answer.user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <span className="font-semibold">{answer.user.username}</span>
              {/* <span className="text-gray-500 text-sm">answered {answer.createdAt}</span> */}
            </div>
            <div className="prose prose-sm max-w-none mb-4">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {answer.body}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUpvoteAnswer(answer.id)}
                  className="flex items-center space-x-1"
                >
                  <ChevronUp className="w-4 h-4" />
                  <span>{answer.upvotes.length}</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="w-4 h-4" />
                  <span>{answer.downvotes.length}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>;

<Card>
  <CardHeader>
    <h3 className="font-semibold">Start a Discussion</h3>
  </CardHeader>
  <CardContent className="space-y-4">
    <div className="flex items-start space-x-3">
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.image || "/globe.svg"} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-3">
        <Textarea
          placeholder="Share your thoughts, ask follow-up questions, or start a discussion..."
          value={newDiscussion}
          onChange={(e) => setNewDiscussion(e.target.value)}
          className="min-h-[80px]"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setNewDiscussion("")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitDiscussion}
            disabled={!newDiscussion.trim()}
          >
            Post Discussion
          </Button>
        </div>
      </div>
    </div>
  </CardContent>
</Card>;

<div className="space-y-4">
              {data?.discussions.map((discussion) => (
                <Card key={discussion.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={discussion.user.image || "/globe.svg"}
                        />
                        <AvatarFallback>
                          {discussion.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-sm">
                            {discussion.user.username}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {discussion.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                          {discussion.content}
                        </p>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpvoteDiscussion(discussion.id)
                              }
                              disabled={discussion.alreadyUpvoted}
                              className="flex items-center space-x-1 h-7 text-xs"
                            >
                              <ChevronUp className="w-3 h-3" />
                              <span>{discussion.upvotes.length}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7"
                              disabled={discussion.alreadyDownvoted}
                            >
                              <ChevronDown className="w-3 h-3" />
                              <span>{discussion.downvotes.length}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>