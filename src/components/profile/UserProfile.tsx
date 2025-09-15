import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit3, MapPin, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import ProfileEditor from "./ProfileEditor";

export interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
  location: string;
  interests: string[];
  engagementScore: number;
}

const defaultProfile: UserProfile = {
  name: "Your Name",
  bio: "Tell us about yourself...",
  avatar: "",
  location: "Your Location",
  interests: [],
  engagementScore: 0
};

const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("ares_user_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("ares_user_profile", JSON.stringify(newProfile));
  };

  const generateEngagementScore = () => {
    const views = Number(localStorage.getItem("ares_views") || 0);
    const likes = Number(localStorage.getItem("ares_likes") || 0);
    const suggestions = JSON.parse(localStorage.getItem("ares_suggestions") || "[]").length;
    return Math.min(99999, Math.floor((views * 10) + (likes * 25) + (suggestions * 15) + Math.random() * 5000));
  };

  useEffect(() => {
    const score = generateEngagementScore();
    if (score !== profile.engagementScore) {
      const updatedProfile = { ...profile, engagementScore: score };
      setProfile(updatedProfile);
      localStorage.setItem("ares_user_profile", JSON.stringify(updatedProfile));
    }
  }, []);

  return (
    <>
      <Card className="bg-gradient-to-br from-black/80 via-gray-900/50 to-black/80 backdrop-blur border border-white/20 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-white">My Profile</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.bio}</p>
              {profile.location && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.location}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Engagement Score</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {profile.engagementScore.toLocaleString()}
            </div>
          </div>

          {profile.interests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Interests</p>
              <div className="flex flex-wrap gap-1">
                {profile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </>
  );
};

export default UserProfile;