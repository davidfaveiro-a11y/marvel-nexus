import { describe, expect, it } from "vitest";
import { cardSchema, collectionSchema, invitationCodeSchema, signUpSchema } from "./index";

describe("invitation validation", () => {
  it("accepts uppercase private invitation codes", () => {
    expect(invitationCodeSchema.parse("MARVEL-123")).toBe("MARVEL-123");
  });

  it("rejects unsafe invitation characters", () => {
    expect(() => invitationCodeSchema.parse("bad code")).toThrow();
  });
});

describe("signup validation", () => {
  it("requires matching passwords and accepted rules", () => {
    expect(() =>
      signUpSchema.parse({
        invitationCode: "PRIVATE-1",
        email: "player@example.test",
        password: "long-password",
        confirmPassword: "different-password",
        username: "player_one",
        acceptedPrivateRules: true,
      }),
    ).toThrow();
  });
});

describe("catalog validation", () => {
  it("accepts a valid collection payload", () => {
    expect(
      collectionSchema.parse({
        name: "Nexus Core",
        description: "Collection de test",
        primaryColor: "#38BDF8",
        displayOrder: 1,
        isActive: true,
      }),
    ).toEqual({
      name: "Nexus Core",
      description: "Collection de test",
      primaryColor: "#38BDF8",
      displayOrder: 1,
      isActive: true,
    });
  });

  it("rejects invalid card weights", () => {
    expect(() =>
      cardSchema.parse({
        publicNumber: 1,
        characterId: "00000000-0000-0000-0000-000000000001",
        collectionId: "00000000-0000-0000-0000-000000000002",
        rarityId: "00000000-0000-0000-0000-000000000003",
        editionName: "Core Edition",
        xpValue: 5,
        duplicateValue: 2,
        drawWeight: 0,
        isActive: true,
        isEventCard: false,
        frameStyle: "standard",
        animationProfile: "standard",
        displayOrder: 1,
      }),
    ).toThrow();
  });
});
