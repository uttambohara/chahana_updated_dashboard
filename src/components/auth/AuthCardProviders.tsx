import React from "react";
import { Button } from "../ui/button";
import { Chrome, Github } from "lucide-react";

export default function SocialLoginLink() {
  return (
    <div className="space-y-2">
      <Button className="w-full" variant="outline">
        <Chrome className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button className="w-full" variant="outline">
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}
