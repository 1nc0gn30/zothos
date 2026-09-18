import './UtilitiesSection.css'

const UtilitiesSection = ({
  profile,
  handleProfileChange,
  wishlistName,
  setWishlistName,
  wishlistGift,
  setWishlistGift,
  handlePrintWish,
  wishOutput,
  secretChallenge,
  setSecretChallenge
}) => {
  return (
    <section className="section utilities" id="santa-tools">
      <div className="section__header">
        <h2>Santa Tools & Retro Utilities</h2>
        <p className="section__sub">Print a plaza wish-slip, spin up a secret challenge, and keep the sleigh in sight.</p>
      </div>
      <div className="utilities__grid">
        <div className="utility__card profile__card">
          <div className="panel__title">Create Your Plaza Profile</div>
          <div className="panel__body utility__body">
            <p className="panel__hint">
              Saved in your browser sleigh-bag (localStorage). Clearing cache yeets it into the snow — JavaScript on, Adobe Flash
              installed (jk lol), and you&apos;re golden.
            </p>
            <label className="panel__label" htmlFor="profile-name">
              Plaza alias
            </label>
            <input
              id="profile-name"
              value={profile.alias}
              onChange={(event) => handleProfileChange('alias', event.target.value)}
              placeholder="e.g., CRTCommander"
            />
            <label className="panel__label" htmlFor="profile-bio">
              Holiday flex
            </label>
            <input
              id="profile-bio"
              value={profile.bio}
              onChange={(event) => handleProfileChange('bio', event.target.value)}
              placeholder="90s snack, favorite mall memory, etc."
            />
            <label className="panel__label" htmlFor="profile-gift">
              Dream haul
            </label>
            <input
              id="profile-gift"
              value={profile.favoriteGift}
              onChange={(event) => handleProfileChange('favoriteGift', event.target.value)}
              placeholder="e.g., translucent Game Boy + snow globe"
            />
            <label className="panel__label" htmlFor="profile-flair">
              Flair emoji
            </label>
            <input
              id="profile-flair"
              value={profile.flair}
              onChange={(event) => handleProfileChange('flair', event.target.value || '🎄')}
              maxLength={4}
            />
            <div className="profile__preview">
              <div className="profile__avatar" aria-hidden>
                {profile.flair || '🎄'}
              </div>
              <div>
                <p className="profile__title">{profile.alias || 'Anonymous Mall Elf'}</p>
                <p className="profile__meta">{profile.bio || 'Type a line to light up your badge.'}</p>
                <p className="profile__gift">Wishlist: {profile.favoriteGift || 'TBD (wrap it in neon)'}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="utility__card">
          <div className="panel__title">Wish-Slip Printer</div>
          <form className="panel__body utility__body" onSubmit={handlePrintWish}>
            <label className="panel__label" htmlFor="wish-name">
              Your 90s alias
            </label>
            <input
              id="wish-name"
              value={wishlistName}
              onChange={(event) => setWishlistName(event.target.value)}
              placeholder="e.g., MallRat97"
            />
            <label className="panel__label" htmlFor="wish-gift">
              Gift you want stamped
            </label>
            <input
              id="wish-gift"
              value={wishlistGift}
              onChange={(event) => setWishlistGift(event.target.value)}
              placeholder="e.g., SNES + neon sled"
            />
            <button type="submit" className="btn btn-primary">Print slip</button>
            <p className="utility__output">{wishOutput || 'Submit to get a printable neon ticket.'}</p>
          </form>
        </div>

        <div className="utility__card">
          <div className="panel__title">Mystery Challenge Deck</div>
          <div className="panel__body utility__body">
            <p className="panel__label">Tonight's dare</p>
            <p className="utility__challenge">{secretChallenge}</p>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setSecretChallenge(
                  [
                    'Drop a Mariah whistle note in the plaza chat to spawn glitter.',
                    'Find the Tamagotchi hotspot and leave it idle — does the snow pet nap?',
                    'Trigger all four unlocks before 11:59 to summon candy-cane scanlines.',
                    'Switch on Turbo Man, then refresh the Santa radar to watch the sleigh race him.'
                  ][Math.floor(Math.random() * 4)]
                )
              }
            >
              Deal a new challenge
            </button>
            <p className="panel__hint">Complete it to earn bragging rights on the CRT monitor.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UtilitiesSection
