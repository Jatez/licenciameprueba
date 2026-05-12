"""Seed script - creates test data for local development."""
import asyncio
import uuid
import random
from datetime import date, datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import get_settings
from app.core.security import hash_password
from app.models.base import Base
from app.models.auth import Company, User, RefreshToken
from app.models.packages import PackageTemplate, LicensePackage, PackageTrackEntitlement
from app.models.catalog import Track, TrackLicenseRule
from app.models.social import SocialAccount
from app.models.publishing import PublishSession, PublishedUsage
from app.models.monitoring import ExternalContent, AudioDetection
from app.models.analytics import UsageMetricsSnapshot, RecommendationSnapshot
from app.models.audit import AuditLog


# ── Genre-specific word banks for realistic track generation ──────────────
GENRE_DATA: dict[str, dict] = {
    "reggaeton": {
        "titles": ["Perreo", "Bellaqueo", "Fuego", "Gasolina", "Caliente", "Dembow", "Flow", "Sandungueo",
                    "Pum Pum", "Tra Tra", "Dale", "Duro", "Gata", "Rompe", "Soltera", "Loco", "Party",
                    "Noche", "Baila", "Sube", "Prende", "Booty", "Yandel", "Calle", "Perrear",
                    "Reggae", "Mueve", "Twerk", "Beso", "Safaera", "Descontrol", "Gyal"],
        "artists": ["J Balvin", "Ozuna", "Anuel AA", "Farruko", "Maluma", "Nicky Jam", "Daddy Yankee",
                     "Bad Bunny", "Karol G", "Lunay", "Myke Towers", "Rauw Alejandro", "Sech",
                     "El Alfa", "Jhayco", "De La Ghetto", "Zion & Lennox", "Wisin y Yandel",
                     "Don Omar", "Tego Calderón", "Arcángel", "Feid", "Ryan Castro", "Blessd"],
        "bpm_range": (88, 100),
    },
    "pop": {
        "titles": ["Love", "Heart", "Dream", "Stars", "Shine", "Forever", "Wonder", "Golden",
                    "Beautiful", "Light", "Wings", "Cloud", "Melody", "Rain", "Sky", "Magic",
                    "Sunset", "Morning", "Rainbow", "Kiss", "Secrets", "Paradise", "Hope",
                    "Gravity", "Eclipse", "Silk", "Velvet", "Crystal", "Bloom", "Echo"],
        "artists": ["Luna Stars", "Valentina", "The Sparks", "Mia Torres", "Carlos Rey",
                     "Daniela Sol", "Acoustic Hearts", "Sofia Moon", "Pablo & The Waves",
                     "Elena Rose", "The Dreamers", "Camila Luz", "Nico Sound", "Andrea Vega",
                     "Los Brillantes", "The Neon Lights", "Clara White", "Diego Frost",
                     "Marina Blue", "Alejandra Storm", "The Echoes", "Royal Sound"],
        "bpm_range": (100, 130),
    },
    "hip-hop": {
        "titles": ["Trap", "Flexin", "Drip", "Hustle", "Money", "Gang", "Real", "Streets",
                    "Hood", "Ice", "Grind", "Paper", "Ride", "Ghost", "Savage", "Crown",
                    "Chains", "Boss", "Racks", "Empire", "Legend", "King", "Throne", "Black",
                    "Smoke", "Bounce", "Cypher", "Bars", "Diamonds", "Platinum"],
        "artists": ["MC Flow", "Lil Tempo", "DJ Scratch", "Young Blaze", "Rap Royalty",
                     "The Syndicate", "Urban Kings", "Street Poets", "Mic Masters",
                     "The Collective", "Flow Nation", "Rebel Rhymes", "24K Gold",
                     "Black Diamond", "Royal Flush", "Big Smoke", "The Architects",
                     "Ghost Protocol", "Lyric Lords", "The Foundation"],
        "bpm_range": (70, 100),
    },
    "latin": {
        "titles": ["Cumbia", "Salsa", "Bachata", "Merengue", "Rumba", "Guaguancó", "Son",
                    "Mambo", "Cha Cha", "Bolero", "Vallenato", "Joropo", "Bambuco",
                    "Morena", "Corazón", "Sabor", "Azúcar", "Fiesta", "Alegría", "Ritmo",
                    "Candela", "Pasión", "Bonita", "Amor", "Magia", "Caribe", "Tropical",
                    "Sonrisa", "Luna", "Mar", "Cielo", "Vida"],
        "artists": ["Ritmo Caliente", "Los Soneros", "Orquesta Caribe", "Son del Valle",
                     "La Cumbia Band", "Grupo Fuego", "Los Tropicales", "Sabor y Son",
                     "La Sonora", "El Combo Latino", "Charanga Real", "Pachanga All Stars",
                     "DJ Latino", "Los Embajadores", "Combo Tropical", "Son de Barrio",
                     "La Herencia", "Los Juglares", "Ritmo y Sabor", "Los Caribeños"],
        "bpm_range": (90, 140),
    },
    "electronic": {
        "titles": ["Pulse", "Neon", "Circuit", "Voltage", "Synth", "Binary", "Laser",
                    "Wave", "Drift", "Cyber", "Matrix", "Pixel", "Orbit", "Quantum",
                    "Frequency", "Bass", "Drop", "Rave", "Glow", "Spectrum", "Aurora",
                    "Horizon", "Zenith", "Flux", "Reactor", "Signal", "Byte", "Prism",
                    "Trance", "Acid", "Vortex", "Strobe"],
        "artists": ["Synth Wave", "Neon Riders", "Digital Dreams", "Bass Theory",
                     "Electro Lab", "Circuit Break", "The Frequencies", "Pulse Engine",
                     "Deep Signal", "Voltage", "Binary Sunset", "Acid House Collective",
                     "Laser Tag", "Glow Stick", "Trance Nation", "DJ Photon", "Rave Lords",
                     "The Machines", "Nebula Sound", "Techno Factory"],
        "bpm_range": (120, 150),
    },
    "rock": {
        "titles": ["Thunder", "Fire", "Storm", "Wild", "Rebel", "Power", "Metal",
                    "Scream", "Shadow", "Fury", "Rage", "Venom", "Iron", "Stone",
                    "Hammer", "Blade", "Wolf", "Phoenix", "Inferno", "Lightning",
                    "Riff", "Shred", "Amplified", "Overdrive", "Distortion",
                    "Riot", "Anthem", "Revolution", "Warzone", "Abyss"],
        "artists": ["Thunder Road", "The Outlaws", "Iron Will", "Rebel Saints",
                     "Stone Temple", "Shadow Puppets", "Phoenix Rising", "Wolf Pack",
                     "Lightning Strike", "The Razors", "Midnight Riders", "Steel Cage",
                     "Sonic Boom", "Crimson Tide", "Rock Nation", "The Amplifiers",
                     "Black Sabbath Tribute", "Led Revival", "The Voltage", "Power Chords"],
        "bpm_range": (110, 160),
    },
    "r&b": {
        "titles": ["Smooth", "Velvet", "Silk", "Touch", "Desire", "Honey", "Passion",
                    "Midnight", "Satin", "Glow", "Whisper", "Tender", "Bliss", "Caress",
                    "Soul", "Heat", "Taste", "Slow", "Deep", "Mood", "Vibe", "Fever",
                    "Sweet", "Lust", "Romance", "Wine", "After Hours", "Pillow Talk"],
        "artists": ["Silk & Soul", "Velvet Voice", "The Smooths", "Midnight Blue",
                     "Soul Kitchen", "R&B Nation", "Honey Groove", "The Vibes",
                     "Satin Dreams", "Mood Ring", "After Dark", "Sweet Tones",
                     "Deep Feels", "The Whispers", "Groove Theory", "Neo Soul Revival",
                     "Bliss Orchestra", "Tender Touch", "The Slow Jams", "NightCap"],
        "bpm_range": (60, 90),
    },
    "reggae": {
        "titles": ["One Love", "Jah", "Roots", "Zion", "Island", "Herb", "Sunshine",
                    "Vibes", "Peace", "Freedom", "Unity", "Irie", "Babylon", "Rasta",
                    "Dub", "Riddim", "Reggae", "Ska", "Uplift", "Steppin",
                    "Yard", "Kingston", "Mount Zion", "Good Times", "Feel Good"],
        "artists": ["Reggae Roots", "Island Vibes", "Zion Tribe", "Jah Warriors",
                     "The Irie Band", "Rasta Sound", "Kingston Crew", "Dub Masters",
                     "Sunshine Reggae", "One Love Collective", "Riddim Nation",
                     "Peace Makers", "The Skatalites Tribute", "Jah Blessing",
                     "Root Down", "Island Fire", "Vibes Up", "Tropics Band"],
        "bpm_range": (65, 85),
    },
    "jazz": {
        "titles": ["Blue Note", "Improvisation", "Satin Doll", "Moonlight", "Coltrane",
                    "Bebop", "Swing", "Dizzy", "Groove", "Modal", "Cool", "Ballad",
                    "Standard", "Nocturne", "Interlude", "Cadence", "Harmony",
                    "Fusion", "Bossa", "Samba", "Quartet", "Blues", "Sonata",
                    "Prelude", "Overture", "Concerto", "Serenade", "Rhapsody"],
        "artists": ["Blue Note Quartet", "The Jazz Collective", "Bebop All Stars",
                     "Cool Jazz Trio", "Fusion Lab", "Bossa Nova Club", "Sax Appeal",
                     "Piano Bar", "Midnight Jazz", "Swing Kings", "Modal Theory",
                     "The Standards", "Jazz Factory", "Improvisation Nation",
                     "Latin Jazz Ensemble", "Smooth Jazz FM", "Night Owl Trio"],
        "bpm_range": (70, 140),
    },
    "acoustic": {
        "titles": ["Campfire", "Morning", "Breeze", "Willow", "River", "Mountain",
                    "Sunrise", "Meadow", "Serene", "Petal", "Leaf", "Timber",
                    "Warmth", "Cottage", "Amber", "Gentle", "Silent", "Tranquil",
                    "Rustic", "Folk", "Ballad", "Strings", "Cedar", "Ember",
                    "Trail", "Candlelight", "Whistle", "Barefoot"],
        "artists": ["Acoustic Duo", "Folk Tales", "The Campfire Band", "Morning Light",
                     "Willow & Oak", "River Sound", "Mountain Echo", "Sunrise Sessions",
                     "The Strummers", "Cedar & Pine", "Barefoot Sessions",
                     "Meadow Song", "The Troubadours", "Petal & Vine",
                     "Gentle Storm", "The Settlers", "Open Mic Heroes"],
        "bpm_range": (80, 120),
    },
    "tropical": {
        "titles": ["Playa", "Sol", "Arena", "Ola", "Brisa", "Palma", "Coco",
                    "Caribe", "Isla", "Mar", "Atardecer", "Verano", "Surf",
                    "Paradise", "Beach", "Sunset", "Wave", "Coral", "Laguna",
                    "Tropic", "Manglar", "Bahía", "Costa", "Marejada",
                    "Horizonte", "Viento", "Marea", "Litoral"],
        "artists": ["Sol y Mar", "Playa Sound", "Tropical Beats", "DJ Tropico",
                     "Caribe Session", "Beach Vibes", "Island Groove", "Sunset Crew",
                     "Costa del Sol", "Palma Real", "Ola Latina", "Bahía Club",
                     "Mar Adentro", "Los Surfistas", "Tropic Thunder",
                     "La Ola Band", "Arena y Sol", "Coral Sound"],
        "bpm_range": (95, 125),
    },
    "urbano": {
        "titles": ["Calle", "Barrio", "Noche", "Perreo", "Flow", "Clandestino",
                    "Bajo", "Duro", "Glock", "Bichote", "Real", "Tiraera",
                    "Fronteo", "Dembow", "Prende", "Mode", "Vibra", "Conexión",
                    "Money", "Lujo", "Trap", "Drip", "Ice", "Flexeo",
                    "Combo", "Black", "Hood", "Ghetto", "Elite", "Premium"],
        "artists": ["Calle 13 Tribute", "Barrio Kings", "Urban Flow", "El Clandestino",
                     "Bajo Zero", "Los de la Noche", "Trap House", "Real Gangsters",
                     "Fronteo Gang", "El Bichote", "Street Wisdom", "La Conexión",
                     "Ice Kings", "Drip Squad", "Premium Sound", "Hood Stars",
                     "Elite Beats", "Combo Urbano", "Night Riders", "Flex Nation"],
        "bpm_range": (70, 95),
    },
    "country": {
        "titles": ["Dusty Road", "Pickup", "Whiskey", "Boots", "Ranch", "Cowboy",
                    "Saddle", "Barn", "Honky Tonk", "Steel", "Rodeo", "Texas",
                    "Nashville", "Highway", "Prairie", "Dirt", "Creek", "Moonshine",
                    "Old Town", "Sunset Ridge", "Back Porch", "River Bend",
                    "Blue Sky", "Country Road", "Frontporch", "Heartland"],
        "artists": ["Country Mile", "Nashville Nights", "The Cowboys", "Steel Guitar Band",
                     "Honky Tonk Heroes", "Ranch Hands", "Texas Sun", "The Outlaws Country",
                     "Prairie Fire", "Dirt Road Band", "Moonshine Crew", "Highway Band",
                     "Blue Ridge", "The Ranchers", "Old Town Acoustic"],
        "bpm_range": (90, 130),
    },
    "funk": {
        "titles": ["Groove", "Slap", "Jam", "Funky", "Bass", "Get Up", "Shake",
                    "Disco", "Boogie", "Parliament", "Thick", "Pocket", "Snappy",
                    "Wah", "Clap", "Tight", "Fresh", "Juice", "Swagger", "Strut",
                    "Bounce", "Floor", "Dance Machine", "Superfly", "Brick House"],
        "artists": ["The Funk Factory", "Groove Machine", "Slap Bass Club", "Funky Town",
                     "Parliament Tribute", "The Pocket", "Disco Reflex", "Boogie Nights",
                     "Super Fly", "The Groove Merchants", "Bass Brothers",
                     "Jam Session", "Fresh Funk", "Dance Floor Killers"],
        "bpm_range": (100, 130),
    },
    "classical": {
        "titles": ["Opus", "Nocturne", "Sonata", "Allegro", "Adagio", "Concerto",
                    "Symphony", "Prelude", "Overture", "Waltz", "Étude", "Requiem",
                    "Fantasia", "Rondo", "Fugue", "Canon", "Suite", "Aria",
                    "Minuet", "Serenade", "Caprice", "Rhapsody", "Elegy", "Pavane"],
        "artists": ["Camerata Strings", "Philharmonic Studio", "Chamber Ensemble",
                     "Solo Piano Works", "Virtuoso Quartet", "Classical Collective",
                     "The New Romantics", "Baroque Revival", "Symphonia",
                     "Piano Anthology", "String Theory Ensemble", "The Classicists"],
        "bpm_range": (50, 140),
    },
}

# Adjectives/modifiers for title variation
TITLE_MODIFIERS = [
    "", "Midnight", "Summer", "Dark", "Golden", "Electric", "Sacred", "Lost", "Wild",
    "Eternal", "Deep", "Neon", "Crystal", "Royal", "Urban", "Secret", "Savage", "Sweet",
    "Cold", "Hot", "Burning", "Frozen", "Silent", "Cosmic", "Digital", "Vintage", "Raw",
    "Pure", "Heavy", "Soft", "Slow", "Fast", "Latin", "Funky", "Tropical", "Dreamy",
]

TITLE_SUFFIXES = [
    "", "Remix", "Pt. 2", "Deluxe", "Extended", "Live", "Remastered", "Version",
    "Mix", "Edit", "Session", "Vibes", "2.0", "Revisited", "Unplugged",
]


def generate_tracks(count: int = 1050) -> list[dict]:
    """Generate a diverse catalog of tracks across genres."""
    tracks = []
    genres = list(GENRE_DATA.keys())
    used_isrcs: set[str] = set()

    # Distribute approximately evenly, with some randomness
    per_genre = count // len(genres)
    remainder = count % len(genres)

    for gi, genre in enumerate(genres):
        genre_count = per_genre + (1 if gi < remainder else 0)
        data = GENRE_DATA[genre]
        titles = data["titles"]
        artists = data["artists"]
        bpm_lo, bpm_hi = data["bpm_range"]

        for i in range(genre_count):
            # Generate unique title
            base_title = random.choice(titles)
            modifier = random.choice(TITLE_MODIFIERS)
            suffix = random.choice(TITLE_SUFFIXES) if random.random() < 0.15 else ""
            title_parts = [p for p in [modifier, base_title, suffix] if p]
            title = " ".join(title_parts)

            artist = random.choice(artists)
            if random.random() < 0.15:
                # Collaboration
                feat = random.choice(artists)
                if feat != artist:
                    title += f" (feat. {feat})"

            # ISRC: CO-LM-YY-NNNNN
            while True:
                isrc = f"COLM{random.randint(2020, 2026)}{random.randint(10000, 99999)}"
                if isrc not in used_isrcs:
                    used_isrcs.add(isrc)
                    break

            duration = random.randint(120, 360)
            bpm = random.randint(bpm_lo, bpm_hi)

            tracks.append({
                "title": title,
                "artist": artist,
                "isrc": isrc,
                "duration": duration,
                "bpm": bpm,
                "genre": genre,
            })

    random.shuffle(tracks)
    return tracks


async def seed():
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, echo=True)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as db:
        # ----- Companies -----
        company_a = Company(id=uuid.uuid4(), name="Acme Records", country_code="CO", status="active")
        company_b = Company(id=uuid.uuid4(), name="Beta Music", country_code="MX", status="active")
        db.add_all([company_a, company_b])
        await db.flush()

        # ----- Users -----
        admin = User(
            id=uuid.uuid4(),
            company_id=company_a.id,
            email="admin@acme.com",
            role="admin",
            password_hash=hash_password("Admin123!"),
            status="active",
            failed_login_attempts=0,
        )
        manager = User(
            id=uuid.uuid4(),
            company_id=company_a.id,
            email="manager@acme.com",
            role="manager",
            password_hash=hash_password("Manager123!"),
            status="active",
            failed_login_attempts=0,
        )
        creator = User(
            id=uuid.uuid4(),
            company_id=company_a.id,
            email="creator@acme.com",
            role="creator",
            password_hash=hash_password("Creator123!"),
            status="active",
            failed_login_attempts=0,
        )
        super_admin = User(
            id=uuid.uuid4(),
            email="superadmin@licenciame.com",
            role="super_admin",
            password_hash=hash_password("Super123!"),
            status="active",
            failed_login_attempts=0,
        )
        beta_user = User(
            id=uuid.uuid4(),
            company_id=company_b.id,
            email="user@beta.com",
            role="manager",
            password_hash=hash_password("Beta123!"),
            status="active",
            failed_login_attempts=0,
        )
        db.add_all([admin, manager, creator, super_admin, beta_user])
        await db.flush()

        # ----- Package Templates -----
        tmpl_starter = PackageTemplate(
            id=uuid.uuid4(), code="starter", name="Starter",
            credits_total=10, duration_days=30, catalog_scope="curated",
            active_track_limit=5, is_active=True,
        )
        tmpl_pro = PackageTemplate(
            id=uuid.uuid4(), code="pro", name="Pro",
            credits_total=50, duration_days=30, catalog_scope="full",
            active_track_limit=None, is_active=True,
        )
        tmpl_enterprise = PackageTemplate(
            id=uuid.uuid4(), code="enterprise", name="Enterprise",
            credits_total=200, duration_days=90, catalog_scope="full",
            active_track_limit=None, is_active=True,
        )
        db.add_all([tmpl_starter, tmpl_pro, tmpl_enterprise])
        await db.flush()

        # ----- License Packages -----
        pkg_acme = LicensePackage(
            id=uuid.uuid4(),
            company_id=company_a.id,
            template_id=tmpl_pro.id,
            package_name="Pro",
            credits_total=50,
            credits_used=3,
            credits_blocked=0,
            start_date=date.today() - timedelta(days=5),
            end_date=date.today() + timedelta(days=25),
            status="active",
        )
        pkg_beta = LicensePackage(
            id=uuid.uuid4(),
            company_id=company_b.id,
            template_id=tmpl_starter.id,
            package_name="Starter",
            credits_total=10,
            credits_used=0,
            credits_blocked=0,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            status="active",
        )
        db.add_all([pkg_acme, pkg_beta])
        await db.flush()

        # ----- Tracks (1050+ songs) -----
        print("🎵 Generating 1050 tracks across 15 genres...")
        track_catalog = generate_tracks(1050)
        tracks = []
        for td in track_catalog:
            t = Track(
                id=uuid.uuid4(), title=td["title"], artist=td["artist"], isrc=td["isrc"],
                s3_key_master=f"tracks/{td['isrc']}/master.wav",
                s3_key_preview=f"tracks/{td['isrc']}/preview.mp3",
                duration_seconds=td["duration"], bpm=td["bpm"], genre=td["genre"],
                rights_reference=f"DT-{td['isrc']}", active=True,
            )
            tracks.append(t)
        # Insert in batches to avoid memory pressure
        batch_size = 200
        for i in range(0, len(tracks), batch_size):
            db.add_all(tracks[i:i + batch_size])
            await db.flush()
            print(f"  ✓ Tracks {i+1}-{min(i+batch_size, len(tracks))} inserted")
        await db.flush()

        # ----- Track License Rules (all tracks, all platforms) -----
        print("📝 Creating license rules for all tracks...")
        platforms_sets = [
            (["instagram", "facebook", "tiktok"], ["ig_reel", "ig_story", "fb_reel", "tiktok_video"]),
        ]
        rules = []
        for track in tracks:
            for plats, ctypes in platforms_sets:
                rule = TrackLicenseRule(
                    id=uuid.uuid4(),
                    track_id=track.id,
                    allowed_platforms=plats,
                    allowed_content_types=ctypes,
                    territories=None,  # Global
                    valid_from=date.today() - timedelta(days=30),
                    valid_until=date.today() + timedelta(days=365),
                    terms_json={"max_duration_seconds": 60, "attribution_required": False},
                )
                rules.append(rule)
        for i in range(0, len(rules), batch_size):
            db.add_all(rules[i:i + batch_size])
            await db.flush()
        print(f"  ✓ {len(rules)} license rules created")
        await db.flush()

        # ----- Curated entitlements for beta (starter package) -----
        for track in tracks[:5]:
            ent = PackageTrackEntitlement(
                id=uuid.uuid4(),
                package_id=pkg_beta.id,
                track_id=track.id,
                activated_at=datetime.now(timezone.utc),
                activated_by_user_id=beta_user.id,
            )
            db.add(ent)
        await db.flush()

        # ----- Social Accounts (no tokens — real scraping uses yt-dlp/instaloader directly) -----
        sa_ig = SocialAccount(
            id=uuid.uuid4(),
            company_id=company_a.id,
            platform="instagram",
            external_account_id="ig_acme_001",
            username="acme_records_ig",
            status="connected",
        )
        sa_tt = SocialAccount(
            id=uuid.uuid4(),
            company_id=company_a.id,
            platform="tiktok",
            external_account_id="tt_acme_001",
            username="acme_records_tt",
            status="connected",
        )
        sa_beta = SocialAccount(
            id=uuid.uuid4(),
            company_id=company_b.id,
            platform="instagram",
            external_account_id="ig_beta_001",
            username="beta_music_ig",
            status="connected",
        )
        db.add_all([sa_ig, sa_tt, sa_beta])
        await db.flush()

        await db.commit()

    await engine.dispose()
    print("\n✅ Seed completed successfully!")
    print(f"\n📋 Test accounts:")
    print(f"  admin@acme.com / Admin123!      (admin, Acme Records)")
    print(f"  manager@acme.com / Manager123!  (manager, Acme Records)")
    print(f"  creator@acme.com / Creator123!  (creator, Acme Records)")
    print(f"  superadmin@licenciame.com / Super123!  (super_admin)")
    print(f"  user@beta.com / Beta123!        (manager, Beta Music)")
    print(f"\n📦 Packages: Acme=Pro(50 credits), Beta=Starter(10 credits)")
    # Count genres
    genre_counts: dict[str, int] = {}
    for td in track_catalog:
        genre_counts[td["genre"]] = genre_counts.get(td["genre"], 0) + 1
    print(f"🎵 Tracks: {len(tracks)} tracks across {len(genre_counts)} genres")
    for g, c in sorted(genre_counts.items(), key=lambda x: -x[1]):
        print(f"    {g}: {c}")
    print(f"📱 Social accounts: Acme=IG+TikTok, Beta=IG")


if __name__ == "__main__":
    asyncio.run(seed())
