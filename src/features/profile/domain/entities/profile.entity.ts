// ==============================================================================
// features/profile/domain/entities/profile.entity.ts
// Profile Entity Class
// ==============================================================================
import { UserProfileEntity, type UserProfileProps } from "@features/authentication/domain/entities/user-profile.entity";

export interface ProfileProps extends UserProfileProps {
  languagePreference?: string;
  themePreference?: string;
}

export class ProfileEntity extends UserProfileEntity {
  public readonly languagePreference: string;
  public readonly themePreference: string;

  constructor(props: ProfileProps) {
    super(props);
    this.languagePreference = props.languagePreference ?? "en";
    this.themePreference = props.themePreference ?? "system";
  }
}
