import { SliderType } from "../components/Explore/BannerSlide"

export const HeaderMenuTitles = [
  {
      name: 'Explore',
      link: 'explore',
  }
]

export const EXPLORE_BANNER_SLIDES: SliderType[] = [
    {
        title: 'WorldWideWebb',
        backgroundImage: '/images/community/backs/webb.jpeg',
        content: (
            <div>
                Worldwide Webb is an interoperable pixel art MMORPG metaverse
                game giving utility to popular NFT projects. The game uses NFTs
                for in-game avatars, pets, lands, NFT Items , and quests.
            </div>
        ),
        button: 'Launch Now',
        path: 'https://webb.game/',
    },
    {
        title: 'DoubleJump',
        backgroundImage: '/images/community/backs/DoubleJump.png',
        content: (
            <div>
                Double Jump is the first race-to-finish, platform-royale game on
                Solana! Race in a mad dash against other Jumpers across the
                world to reach the finish line first.
            </div>
        ),
        button: 'Launch Now',
        path: 'https://theportal.to/',
    },
    {
        title: 'AaveGotchi',
        backgroundImage: '/images/community/backs/Aave.gif',
        content: (
            <div>
                A yield-generating NFT that doubles as a digital pet. Take care
                of them, and they’ll take care of you ^_^
            </div>
        ),
        button: 'Launch Now',
        path: 'https://ev.io',
    },
    {
        title: 'OnCyber',
        backgroundImage: '/images/community/backs/Oncyber.png',
        content: (
            <div>
                A multiverse for creators, oncyber is the easiest way for
                artists and collectors to show their digital assets (NFTs) in
                fully immersive experiences (3D/VR), for free. Holding an item
                from any of these collections allows you to use it as a 3D
                exhibition space.
            </div>
        ),
        button: 'Launch Now',
        path: 'https://miniroyale.io',
    },
    {
        title: 'Decentraland',
        backgroundImage: '/images/community/backs/Dece.png',
        content: (
            <div>
                Decentraland is an Ethereum blockchain-powered virtual world,
                developed and owned by its users, who can create, experience,
                and monetize content and applications. Join a growing community
                of virtual world inhabitants.
            </div>
        ),
        button: 'Launch Now',
        path: 'https://home.panzerdogs.io/',
    },
]