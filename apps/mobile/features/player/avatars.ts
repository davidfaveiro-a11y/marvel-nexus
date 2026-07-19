export interface ProfileAvatar {
  id: string;
  heroName: string;
  imageUrl: string;
  accentColor: string;
}

export const profileAvatars: ProfileAvatar[] = [
  {
    id: "spider-man",
    heroName: "Spider-Man",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/620-spider-man.jpg",
    accentColor: "#E62429",
  },
  {
    id: "iron-man",
    heroName: "Iron Man",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/346-iron-man.jpg",
    accentColor: "#F5B849",
  },
  {
    id: "captain-america",
    heroName: "Captain America",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/149-captain-america.jpg",
    accentColor: "#2F80ED",
  },
  {
    id: "wolverine",
    heroName: "Wolverine",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/717-wolverine.jpg",
    accentColor: "#FFE45C",
  },
  {
    id: "black-panther",
    heroName: "Black Panther",
    imageUrl:
      "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/106-black-panther.jpg",
    accentColor: "#8B5CF6",
  },
  {
    id: "storm",
    heroName: "Storm",
    imageUrl: "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/638-storm.jpg",
    accentColor: "#35C7F4",
  },
];

export const defaultProfileAvatar = profileAvatars[0];

export function resolveProfileAvatar(heroName?: string | null, imageUrl?: string | null) {
  const knownAvatar = profileAvatars.find((avatar) => avatar.heroName === heroName);
  return (
    knownAvatar ?? {
      ...defaultProfileAvatar,
      heroName: heroName || defaultProfileAvatar.heroName,
      imageUrl: imageUrl || defaultProfileAvatar.imageUrl,
    }
  );
}
