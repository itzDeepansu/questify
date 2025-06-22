import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
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
              "Postgresql",
            ].map((topic, index) => (
              <Link href={`/topic/${topic}`} key={index}>
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  {topic}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Topicsbar;
