import React from 'react'
import { Card, CardContent , CardHeader } from "./ui/card";
import { Button } from "./ui/button";
const Topicsbar = () => {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Trending Topics</h3>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            {[
              "React Development",
              "Machine Learning",
              "Career Advice",
              "Startup Tips",
              "Web Design",
            ].map((topic, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-sm"
              >
                {topic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Topicsbar
