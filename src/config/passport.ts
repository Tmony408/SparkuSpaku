import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { env } from './env';
import { UserModel } from '../modules/users/user.model';

export function configurePassport() {
  if (!env.googleClientId || !env.googleClientSecret || !env.googleCallbackUrl) {
    // eslint-disable-next-line no-console
    console.warn('Google OAuth env vars not set. Google login will not work until configured.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: env.googleCallbackUrl
      },
      async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const googleId = profile.id;
          if (!email) return done(null, false);

          let user = await UserModel.findOne({ googleId });

          if (!user) {
            user = await UserModel.findOne({ email });
            if (user) {
              user.googleId = googleId;
              user.authProvider = 'google';
              user.isVerified = true;
              user.displayName = user.displayName || profile.displayName || null;
              await user.save();
            }
          }

          if (!user) {
            user = await UserModel.create({
              email,
              googleId,
              authProvider: 'google',
              isVerified: true,
              displayName: profile.displayName || null
            });
          }

          return done(null, user.toObject() as any);
        } catch (e) {
          return done(e as Error);
        }
      }
    )
  );
}
