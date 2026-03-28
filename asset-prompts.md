# MaumTeo 에셋 생성 프롬프트 총목록

> ## 공통 스타일 가이드
>
> ### 스타일 앵커 (모든 프롬프트 앞에 붙임)
> - **성인 캐릭터**: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, adult character in their 20s-30s, clean white background, 1:1 square composition, no text, no watermark`
> - **아동 캐릭터**: `soft watercolor illustration, warm kawaii style, rounded features, bright cheerful pastel palette, child/teenager age 7-17, school uniform or casual colorful clothes, clean white background, 1:1 square composition, no text, no watermark`
> - **영유아 캐릭터**: `soft watercolor illustration, ultra kawaii style, very round features, oversized head, chubby cheeks, soft dreamy pastel palette, toddler/infant age 1-5, cute onesie or soft clothing, clean white background, 1:1 square composition, no text, no watermark`
> - **성인 상담사**: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, professional therapist, smart casual attire with lanyard, warm approachable expression, clean white background, 1:1 square composition, no text, no watermark`
> - **아동 상담사**: `soft watercolor illustration, warm kawaii style, rounded features, bright pastel palette, child therapist, friendly casual-professional attire with colorful accents, playful warm expression, clean white background, 1:1 square composition, no text, no watermark`
> - **영유아 상담사**: `soft watercolor illustration, warm kawaii style, rounded features, soft dreamy pastel palette, infant development specialist, comfortable nurturing attire, gentle maternal/paternal presence, clean white background, 1:1 square composition, no text, no watermark`
> - **성인 시설/배경**: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted earth tones with teal/violet accents, warm ambient lighting, cozy clinical atmosphere, no text, no watermark`
> - **아동 시설/배경**: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm yellow/orange/sky-blue accents, colorful but organized, natural light, playful safe atmosphere, no text, no watermark`
> - **영유아 시설/배경**: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, baby pink/mint/lavender accents, rounded furniture, ultra-soft atmosphere, gentle diffused light, no text, no watermark`
> - **뱃지/아이콘**: `game achievement badge icon, metallic border, symbolic center motif, clean transparent background, 1:1 square, polished game UI style, no text, no watermark`
>
> ### 감정 상태별 조명 통일
> - **calm (안정)**: `soft teal-green ambient glow, peaceful atmosphere`
> - **neutral (중간)**: `cool blue-gray ambient lighting, slightly tense atmosphere`
> - **distress (고통)**: `warm red-orange ambient glow, distressed but still gentle art style`
>
> ### Negative prompt (모든 생성에 공통)
> `text, watermark, signature, logo, realistic photo, 3d render, scary, horror, violence, blood, self-harm, nudity, deformed, blurry, low quality, multiple views, comic panels, speech bubbles`
>
> ### 해상도 기준
> - 캐릭터 아바타: 512×512px → 256×256 리사이즈 (1:1)
> - 시설 일러스트: 768×576px → 512×384 리사이즈 (4:3)
> - 층 배경: 1920×1080px (16:9)
> - 센터 외관: 800×600px (4:3)
> - 컷씬/이벤트: 1280×720px (16:9)
> - 업적 뱃지: 256×256px → 128×128 리사이즈 (1:1)
> - UI 아이콘: 256×256px → 128×128 리사이즈 (1:1)
>
> ### 포맷
> 생성 후 Squoosh(squoosh.app) 또는 ShareX+cwebp에서 WebP 변환 (품질 80%)
>
> ### 윤리 가이드라인
> - 자해/폭력/공포 장면 절대 불가
> - 아동 캐릭터는 보호적이고 따뜻한 분위기
> - 섭식장애: 극단적 체형 금지, 걱정스러운 표정으로 대체
> - 정서위기: "감정의 폭풍" 은유적 표현만 (소용돌이 색채 모티프)
>
> ### 스테이지별 색감 톤 차이
> - **성인센터**: 차분한 어스톤 — teal, muted violet, warm brown, slate gray
> - **아동센터**: 밝고 활기찬 — amber, sky blue, coral, lime green
> - **영유아센터**: 부드럽고 몽환적 — baby pink, mint, lavender, cream
>
> ### BGM 길이 기준
> - Suno.ai 무료 티어 최대 **4분 (240초)** → 전곡 4분으로 생성
> - 타이쿤 게임 BGM 일반 기준: 2~4분 루프 (심시티, 투포인트호스피탈 참고)
> - 4분이면 반복감 없이 충분, MP3 128kbps 기준 약 3.8MB/곡 → 7곡 총 ~27MB
> - OGG Vorbis 변환 시 ~2MB/곡 → 7곡 ~14MB (권장)

---

## 1. 성인 내담자 캐릭터 (21개)

> 경로: `public/assets/characters/patient/`
> 크기: 256×256px (1:1 정사각형)
> Leonardo.ai 설정: 1:1 비율, 512×512 생성 후 256으로 리사이즈
> 기존 depression 3개와 동일한 톤 유지
> **모든 캐릭터 프롬프트 끝에 `, 1:1 square composition` 추가할 것**

### 1) 불안 (anxiety)

(1) `anxiety_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, relaxed posture sitting comfortably, gentle relieved smile, hands resting on lap, soft teal ambient lighting, psychological counseling center patient, feeling at peace after overcoming anxiety`

(2) `anxiety_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, slightly tense posture, worried eyes looking sideways, one hand clutching chest area lightly, blue-gray ambient lighting, psychological counseling center patient, mild anxiety visible in expression`

(3) `anxiety_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, hunched shoulders, both hands pressed to chest, rapid breathing expression, furrowed brows, warm red ambient lighting, psychological counseling center patient, experiencing anxiety attack, still gentle kawaii style not scary`

### 2) 관계 (relationship)

(4) `relationship_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, warm open expression, relaxed body language facing forward, slight smile, soft teal ambient lighting, psychological counseling center patient, feeling connected and hopeful about relationships`

(5) `relationship_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, head slightly lowered, lonely expression, arms crossed loosely, blue-gray ambient lighting, psychological counseling center patient, feeling isolated and distant`

(6) `relationship_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, turned slightly away, pained expression, one hand covering face, warm red ambient lighting, psychological counseling center patient, deep interpersonal pain and loneliness`

### 3) 강박 (obsession)

(7) `obsession_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, peaceful relaxed posture, hands resting naturally, calm clear eyes, soft teal ambient lighting, psychological counseling center patient, free from compulsive urges, at ease`

(8) `obsession_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, slightly rigid posture, hands fidgeting, focused concentrated expression, blue-gray ambient lighting, psychological counseling center patient, managing obsessive thoughts`

(9) `obsession_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, tense rigid body, hands performing repetitive motion, strained expression with furrowed brows, warm red ambient lighting, psychological counseling center patient, struggling with compulsive behavior`

### 4) 트라우마 (trauma)

(10) `trauma_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, sitting in warm sunlight, gentle brave smile, open posture with hands on knees, soft teal and golden ambient lighting, psychological counseling center patient, healing from trauma, feeling safe`

(11) `trauma_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, alert watchful eyes, slightly guarded posture, arms close to body, blue-gray ambient lighting, psychological counseling center patient, hypervigilant but managing`

(12) `trauma_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, curled up defensive posture, arms wrapped around self, wide frightened eyes, warm red ambient lighting, psychological counseling center patient, experiencing trauma response, still gentle art style`

### 5) 중독 (addiction)

(13) `addiction_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, determined confident posture, slight proud smile, fist gently clenched in resolve, soft teal ambient lighting, psychological counseling center patient, in recovery, feeling strong and hopeful`

(14) `addiction_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, conflicted expression, one hand reaching forward then pulling back, unfocused gaze, blue-gray ambient lighting, psychological counseling center patient, experiencing craving but resisting`

(15) `addiction_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, disheveled appearance, confused swirling expression, head in hands, warm red ambient lighting, psychological counseling center patient, overwhelmed by urges, chaotic inner state`

### 6) 정서조절 (personality)

(16) `personality_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, stable serene expression, balanced posture, hands in comfortable position, soft teal ambient lighting, psychological counseling center patient, emotionally regulated and grounded`

(17) `personality_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, intense expression on the edge, slightly clenched jaw, restless energy in posture, blue-gray ambient lighting, psychological counseling center patient, emotions building up, trying to stay calm`

(18) `personality_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, emotional overwhelm expression, abstract warm-colored wave or flame motif around the figure as metaphor, tears forming, warm red ambient lighting, psychological counseling center patient, emotional storm`

### 7) 정신증 (psychosis)

(19) `psychosis_calm.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, clear focused eyes, calm centered posture, gentle knowing smile, soft teal ambient lighting, psychological counseling center patient, lucid and present, reality feels solid`

(20) `psychosis_neutral.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, slightly unfocused gaze, head tilted as if listening to something, mild confusion in expression, blue-gray ambient lighting with subtle swirl patterns, psychological counseling center patient, between reality and confusion`

(21) `psychosis_distress.webp`
: `soft watercolor illustration, warm kawaii style, rounded features, gentle pastel palette, clean white background, adult person in their 20s-30s, distant detached expression, abstract geometric fragments floating around head as metaphor for fragmented perception, warm red and purple ambient lighting, psychological counseling center patient, disconnected from reality, depicted gently and respectfully`

---

## 2. 성인 층 배경 (2개)

> 경로: `public/assets/floors/`
> 크기: 1920×1080px (16:9)
> 기존 garden/counseling/basement와 톤 일관성 유지

### 1) 심리상담센터 배경

(1) `insight.webp`
: `wide panoramic illustration, 16:9 aspect ratio, psychological counseling center interior hallway, violet and purple color scheme, soft misty atmosphere with tiny star-like lights on ceiling, meditation corner visible, bookshelves with psychology texts, comfortable armchairs, warm wooden floors, dreamy introspective mood, gentle ambient purple lighting, watercolor style, no people, serene and contemplative space for inner exploration`

### 2) 집중치료센터 배경

(2) `diagnostic.webp`
: `wide panoramic illustration, 16:9 aspect ratio, professional treatment center interior, warm amber and golden color scheme, clinical but cozy environment, therapy room with comfortable furniture, professional assessment tools neatly arranged, warm pendant lighting, wooden accents, potted plants adding life, watercolor style, no people, atmosphere of focused care and expertise`

---

## 3. 성인 내담자 치료중 포즈 (8개)

> 경로: `public/assets/characters/patient/poses/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 문제영역별 상담 장면

(1) `depression_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient sitting on therapy couch, talking with gentle expression, tissue box nearby, soft warm lighting, counseling session scene, hopeful atmosphere, clean white background`

(2) `anxiety_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient sitting with eyes closed practicing deep breathing, hands on belly for breathing exercise, relaxed shoulders, soft warm lighting, counseling session scene, calming atmosphere, clean white background`

(3) `relationship_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient in conversation gesture, open hand movements while speaking, engaged expression, soft warm lighting, counseling session scene, sharing feelings, clean white background`

(4) `obsession_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient doing exposure exercise, slightly nervous but brave expression, hands deliberately placed still on lap, soft warm lighting, counseling session, facing fears with courage, clean white background`

(5) `trauma_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient in safe comfortable posture, holding a grounding object, feet firmly on floor, calm focused expression, soft warm lighting, trauma-informed counseling session, feeling safe, clean white background`

(6) `addiction_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient writing in journal during session, thoughtful expression, pen in hand, recovery worksheet visible, soft warm lighting, motivational counseling session, clean white background`

(7) `personality_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient learning emotion regulation, looking at feelings chart or worksheet, concentrated but calm expression, soft warm lighting, DBT skills training session, clean white background`

(8) `psychosis_treat.webp`
: `soft watercolor illustration, kawaii style, adult patient in supportive conversation, grounded posture, making eye contact, calm engaged expression, soft warm lighting, reality-oriented counseling session, stable and present, clean white background`

---

## 4. 성인 상담사 치료중 포즈 (6개)

> 경로: `public/assets/characters/counselor/poses/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 전공별 상담 장면

(1) `cbt_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist standing at whiteboard with cognitive triangle diagram, pointer in hand, warm encouraging expression, professional but approachable attire, clean white background`

(2) `psychodynamic_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist in deep listening posture, leaning slightly forward, hand on chin, empathetic expression, notepad on lap, classic therapy chair, clean white background`

(3) `interpersonal_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist in open welcoming gesture, both hands visible in conversation, warm smile, interpersonal connection pose, professional attire, clean white background`

(4) `dbt_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist holding emotion regulation worksheet, teaching mindfulness skills, calm centered expression, balanced posture, professional attire, clean white background`

(5) `trauma_focused_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist in protective supportive posture, gentle reassuring expression, creating safe space gesture, warm professional attire, clean white background`

(6) `family_systemic_treat.webp`
: `soft watercolor illustration, kawaii style, professional therapist with family therapy genogram chart, facilitating gesture with both hands, warm inclusive expression, professional attire, clean white background`

---

## 5. 성인 상담사 번아웃 상태 (6개)

> 경로: `public/assets/characters/counselor/poses/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 전공별 번아웃

(1) `cbt_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist at desk, slumped shoulders, hand on forehead, exhausted but still caring expression, messy papers around, dim bluish lighting, professional attire slightly loosened, clean white background`

(2) `psychodynamic_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist leaning back in chair exhausted, glasses pushed up on forehead, heavy eyelids, empty coffee cup nearby, dim bluish lighting, clean white background`

(3) `interpersonal_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist sitting alone looking drained, usually warm expression now faded, hands limp on armrests, dim bluish lighting, clean white background`

(4) `dbt_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist holding head with both hands, overwhelmed expression, scattered worksheets around, dim bluish lighting, clean white background`

(5) `trauma_focused_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist staring blankly, emotional fatigue visible, compassion fatigue expression, sitting still with distant gaze, dim bluish lighting, clean white background`

(6) `family_systemic_burnout.webp`
: `soft watercolor illustration, kawaii style, tired therapist at messy desk, rubbing tired eyes, family therapy charts scattered, empty tea cup, dim bluish lighting, clean white background`

---

## 6. 종결/사고 연출 이미지 (2개)

> 경로: `public/assets/cutscenes/`
> 크기: 1280×720px (16:9)

### 1) 연출 장면

(1) `discharge_scene.webp`
: `wide watercolor illustration, 16:9 aspect ratio, joyful counseling center graduation scene, patient walking toward bright open door with golden sunlight streaming in, counselor waving goodbye warmly from behind, flower petals floating in the air, warm hopeful atmosphere, teal and gold color palette, text-free, emotional and uplifting moment of completing therapy`

(2) `crisis_scene.webp`
: `wide watercolor illustration, 16:9 aspect ratio, urgent counseling center scene, abstract representation of emotional storm, swirling red and orange clouds above a small building, staff rushing with purpose, dramatic but not scary lighting, amber and red color palette, text-free, sense of urgency but professional response, still gentle kawaii-adjacent art style`

---

## 7. NPC 캐릭터 (8개)

> 경로: `public/assets/characters/npc/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 성인 이벤트 NPC

(1) `guardian.webp`
: `soft watercolor illustration, kawaii style, middle-aged parent/guardian character, warm but worried expression, casual neat attire, holding a small bag, visiting counseling center to discuss family member, gentle caring appearance, clean white background`

(2) `reporter.webp`
: `soft watercolor illustration, kawaii style, professional journalist character, holding notepad and pen, curious friendly expression, business casual attire, press badge visible, visiting counseling center for a story, clean white background`

(3) `donor.webp`
: `soft watercolor illustration, kawaii style, generous benefactor character, warm philanthropic smile, smart business attire, holding an envelope or small gift, visiting counseling center to offer support, clean white background`

(4) `inspector.webp`
: `soft watercolor illustration, kawaii style, government inspector character, professional clipboard in hand, neutral evaluating expression, formal suit, visiting counseling center for audit, approachable but official, clean white background`

### 2) 아동/영유아 이벤트 NPC

(5) `teacher.webp`
: `soft watercolor illustration, kawaii style, school teacher character, warm nurturing expression, glasses, holding children's book or folder, school-appropriate attire, consulting about student at counseling center, clean white background`

(6) `wee_officer.webp`
: `soft watercolor illustration, kawaii style, Wee center counselor character, professional caring expression, lanyard with ID badge, holding assessment documents, youth counseling specialist appearance, clean white background`

(7) `probation_officer.webp`
: `soft watercolor illustration, kawaii style, probation officer character, firm but compassionate expression, professional uniform-like attire, holding case files, working with at-risk youth, clean white background`

(8) `gov_official.webp`
: `soft watercolor illustration, kawaii style, government official character, formal but friendly expression, smart suit, holding policy documents, visiting center for funding evaluation, clean white background`

---

## 8. 성인 시설 레벨별 외관 (18개)

> 경로: `public/assets/facilities/`
> 크기: 512×384px
> 기존 Lv.1 에셋 있음 → Lv.2, Lv.3만 추가 (기존 6개는 Lv.1으로 사용)

### 1) 개인상담실 (individual_room)

(1) `individual_room_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted earth tones with teal and violet accents, a counseling room interior level 2 upgrade, spacious room with plush velvet two-seater sofa replacing basic chairs, warm walnut side table with tissue box and water carafe, brass floor lamp casting soft golden pool of light on left, framed abstract watercolor painting on sage-green accent wall, potted peace lily on windowsill, herringbone parquet flooring with woven area rug, warm inviting therapy atmosphere of a seasoned practice, 4:3 aspect ratio, no people, no text`

(2) `individual_room_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted earth tones with teal and violet accents, a premium counseling room interior level 3 luxury upgrade, designer tufted leather armchair and matching chaise longue in cognac brown, floor-to-ceiling built-in oak bookshelf wall filled with psychology texts and small plants, recessed warm LED strip lighting along ceiling coves, large monstera deliciosa in ceramic pot at corner, acoustic fabric panels in muted teal, polished hardwood floor with plush cream rug, diffused afternoon sunlight through linen curtains, serene high-end therapy sanctuary, 4:3 aspect ratio, no people, no text`

### 2) 집단상담실 (group_room)

(3) `group_room_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted violet and cream tones, a group therapy room interior level 2 upgrade, eight plush circular floor cushions in jewel tones arranged in a perfect circle on thick dove-gray carpet, large whiteboard with colorful sticky notes and flip chart easel beside it, two soft pendant lamps overhead casting even warm light, motivational framed prints on lavender walls, tissue box station at each seat, wide window with sheer curtains letting in diffused daylight, supportive communal atmosphere, 4:3 aspect ratio, no people, no text`

(4) `group_room_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted violet and cream tones, a premium group therapy room level 3 luxury, ten ergonomic upholstered swivel chairs in a wide circle on plush charcoal carpet, large interactive digital display board on back wall, custom acoustic wood-slat panels on both side walls for sound absorption, multi-zone recessed LED lighting with warm dimmer glow, indoor climbing ivy on a trellis accent wall, small beverage station with tea and water, polished concrete and oak flooring, refined professional group counseling space, 4:3 aspect ratio, no people, no text`

### 3) 노출치료실 (exposure_lab)

(5) `exposure_lab_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted amber and white tones, an exposure therapy lab interior level 2 upgrade, VR headset on a sleek white desk with padded headrest station, graduated exposure difficulty chart (10 steps) mounted on left wall, dual heart-rate monitoring screens on adjustable arm, small controlled environment chamber with dimmer glass door visible at back, comfortable reclining chair in center with armrests, calming blue LED accent strip along ceiling edge, clinical yet reassuring design with potted succulent on shelf, 4:3 aspect ratio, no people, no text`

(6) `exposure_lab_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted amber and white tones, an advanced exposure therapy lab level 3 high-tech, full VR immersion station with surround-sound speakers and motion platform, triple biofeedback monitors displaying heart rate and skin conductance on curved desk, two separate glass-walled simulation chambers visible through doorways at back, cutting-edge galvanic skin response sensors on side table, ergonomic zero-gravity therapy chair in center, warm indirect lighting mixed with clinical white, sophisticated and state-of-the-art therapeutic technology, 4:3 aspect ratio, no people, no text`

### 4) 마음챙김실 (mindfulness_room)

(7) `mindfulness_room_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted teal and natural wood tones, a mindfulness room interior level 2 upgrade, five round zafu meditation cushions on tatami-style mats, two ambient LED color-changing lamps in copper stands casting soft teal glow, small bamboo water fountain on stone pedestal in corner, ceramic aromatherapy diffuser releasing gentle mist, Tibetan singing bowl and brass chime on low wooden shelf, hanging macrame plant holder with trailing pothos, serene zen atmosphere, 4:3 aspect ratio, no people, no text`

(8) `mindfulness_room_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted teal and natural green tones, a premium mindfulness sanctuary level 3 luxury, large natural skylight in ceiling with real sunbeam falling diagonally, indoor Japanese rock garden with raked white sand and moss-covered stones along one wall, flowing water feature with smooth river rocks, floor-to-ceiling painted nature mural of misty forest on back wall, premium round meditation cushions on heated bamboo floor, incense holder and crystal collection on floating shelf, scent of cedar, ultimate meditative retreat space, 4:3 aspect ratio, no people, no text`

### 5) 가족상담실 (family_room)

(9) `family_room_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted rose-pink and warm beige tones, a family therapy room interior level 2 upgrade, large L-shaped cream fabric sectional sofa with throw pillows, children's play corner at lower-right with small table crayons and wooden blocks, family art supplies in wicker basket, warm pendant lamp hanging overhead, framed family-themed artwork on blush-pink accent wall, soft geometric-patterned area rug, two-zone design separating adult seating from kid activity area, homey yet professional atmosphere, 4:3 aspect ratio, no people, no text`

(10) `family_room_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted rose-pink and warm beige tones, a premium family therapy suite level 3, large observation room with one-way mirror window framed in oak on left wall, separate children's therapy nook visible through arched doorway at back with colorful play kitchen and puppet theater, main family interaction space with crescent-shaped modular sofa, digital genogram display on side table, professional sand tray with miniature family figurines, warm recessed lighting with dimmer, fresh flowers in ceramic vase on coffee table, modern warm design, 4:3 aspect ratio, no people, no text`

### 6) 활동치료실 (activity_room)

(11) `activity_room_lv2.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted green and warm yellow tones, an activity therapy room level 2 upgrade, art supply station with wooden easels and glass jars of paint brushes on left, music corner with acoustic guitar on stand and djembe drum on right, three rolled-up yoga mats in wicker basket near window, creative expression wall covered in colorful abstract patient artwork, potted fern hanging from ceiling hook, warm natural light through large windows, light wooden floor with scattered paint-splatter marks adding character, multi-activity therapeutic design, 4:3 aspect ratio, no people, no text`

(12) `activity_room_lv3.webp`
: `soft watercolor illustration, gentle pastel palette, warm professional interior design, muted green and warm yellow tones, a comprehensive activity therapy center level 3, full art studio section with professional easels canvas and kiln-ready pottery wheel on left, music therapy corner with upright piano and hand percussion rack on right, movement therapy space with floor-to-ceiling mirror wall and ballet barre at back, hanging macrame planters and dried flower garlands from exposed wooden beams, warm skylights overhead flooding room with golden light, polished concrete floor with colorful rugs, premium creative healing sanctuary, 4:3 aspect ratio, no people, no text`

---

## 9. 아동 시설 일러스트 (24개: 기본 6 + Lv.2 6 + Lv.3 6 + 내부 6)

> 기본/Lv: `public/assets/facilities-child/`
> 내부: `public/assets/facilities-child/interior/`
> 기본/Lv 크기: 512×384px, 내부: 512×384px

### 1) 놀이치료실 (play_room)

(1) `play_room.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm yellow and sky-blue accents, a child play therapy room, colorful wooden toy shelves neatly organized along back wall with labeled bins, sand tray therapy table with miniature figurines in center, Victorian-style dollhouse in corner, art corner with crayons colored pencils and finger paint in mason jars, soft cream carpet floor with rainbow hopscotch mat, cloud-shaped ceiling lamp casting warm even light, hand-painted animal mural (rabbit fox owl) on left wall, child-safe rounded furniture edges, inviting atmosphere for ages 7-12, 4:3 aspect ratio, no people, no text`

(2) `play_room_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm yellow and sky-blue accents, upgraded child play therapy room, expanded therapeutic toy collection on floor-to-ceiling shelving with picture labels, puppet theater corner with velvet curtain stage at back, sensory play station with kinetic sand and water beads on left, two colorful pendant lamps in star and moon shapes overhead, larger professional sand tray table with extensive figurine collection (animals families houses), bean bag reading nook by window, rainbow bunting garland along ceiling, bright organized and playful, 4:3 aspect ratio, no people, no text`

(3) `play_room_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm yellow and sky-blue accents, premium child play therapy suite, multiple themed play zones separated by low colorful dividers, professional puppet stage with lighting rig and costume rack, interactive digital play wall with touch-projected games on right, dedicated art therapy studio section with child-sized easels and drying rack, floor-to-ceiling window letting in golden sunlight, top-quality therapeutic toys including emotion dolls and feeling wheels, whimsical tree-branch bookshelf, dream playroom designed for healing, 4:3 aspect ratio, no people, no text`

(4) `play_room_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a play therapy room, sand tray table with miniature figures in mid-ground, colorful puppets arranged on a wooden shelf at back wall, toy bins with picture labels at child height, small dollhouse visible in far corner, warm afternoon sunlight streaming through a large window on the right casting long golden shadows, soft cream carpet with scattered cushions, cloud-shaped ceiling lamp glowing warmly, inviting safe playful atmosphere, 4:3 aspect ratio, no people, no text`

### 2) 부모상담실 (parent_room)

(5) `parent_room.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm orange and cream accents, a parent consultation room in a child counseling center, comfortable caramel-brown two-seater sofa facing a matching armchair across a low wooden coffee table, warm brass table lamp casting golden glow, tissue box and ceramic water pitcher on table, small bookshelf with parenting guides and picture frames (blank) suggesting family photos, terracotta accent wall with framed children's artwork, soft jute area rug on light oak floor, cozy professional atmosphere, 4:3 aspect ratio, no people, no text`

(6) `parent_room_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm orange and cream accents, upgraded parent consultation room, larger three-seater sofa with knitted throw blanket and two armchairs forming conversation circle, parenting resource bookshelf with curated titles and pamphlets on back wall, calming landscape artwork in warm tones on peach accent wall, sound-insulation fabric panels in terracotta orange on side walls, improved overhead pendant lighting plus reading lamp, potted peace lily on side table, warm carpet underfoot, 4:3 aspect ratio, no people, no text`

(7) `parent_room_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm orange and cream accents, premium parent consultation suite, large-screen video conferencing setup on wall bracket for remote parent sessions, comprehensive parenting library wall with alphabetized sections and reading nook, separate private meeting nook behind frosted glass partition at back, beverage station with electric kettle ceramic mugs and biscuit tray on wooden console, plush modular seating in warm rust and cream, recessed warm lighting with dimmer control, fresh flowers in ceramic vase, luxurious supportive comfort, 4:3 aspect ratio, no people, no text`

(8) `parent_room_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a parent consultation room, caramel sofa and armchair arranged around a coffee table with tissue box and tea cups in mid-ground, warm brass lamp glowing on side table, parenting bookshelf visible at back wall, framed children's drawings on peach-orange walls, soft jute rug on wooden floor, late afternoon light filtering through sheer curtains on right, warm supportive and homey atmosphere, 4:3 aspect ratio, no people, no text`

### 3) 사회기술훈련실 (group_activity)

(9) `group_activity.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm indigo and sky-blue accents, a social skills training room for children, eight colorful circular floor mats arranged in a circle on soft carpet, low shelving unit filled with cooperative board games and laminated social skills cards, cooperation activity posters with cartoon children on indigo accent wall, interactive whiteboard mounted at child height on front wall, emotion-face poster strip above doorway, ceiling pendant lamps in globe shapes, bright organized and inviting, 4:3 aspect ratio, no people, no text`

(10) `group_activity_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm indigo and sky-blue accents, upgraded social skills room, role-play costume corner with dress-up rack and mirror at back left, video camera on tripod for social skills practice recording at right, expanded cooperative game collection on double-wide shelving, improved group activity space with wider circle area, feelings thermometer poster and conversation starter cards on walls, colorful bunting garland strung across ceiling, child-safe rubber flooring in checkerboard pattern, 4:3 aspect ratio, no people, no text`

(11) `group_activity_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm indigo and sky-blue accents, premium social skills center, simulated real-world scenario corners including a mock grocery store counter with play register and a pretend classroom desk setup, advanced social interaction tools on digital touchscreen table in center, one-way observation gallery window on left wall for therapist monitoring, professional modular seating that reconfigures for different group sizes, social story display rack, LED mood lighting strips along ceiling edges, top-tier group therapy space for children, 4:3 aspect ratio, no people, no text`

(12) `group_activity_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a social skills room, colorful circular floor mats arranged in a circle in mid-ground with a cooperative board game set out in center, low shelving with games and social skills cards at back wall, interactive whiteboard showing cartoon emotion faces on front wall, role-play costume rack visible at far left, bright natural light from windows on right, cheerful organized atmosphere with indigo and sky-blue color scheme, 4:3 aspect ratio, no people, no text`

### 4) 아동노출치료실 (exposure_child)

(13) `exposure_child.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm amber and golden accents, a child-friendly exposure therapy room, graduated difficulty step-ladder chart (10 colorful rungs from green to gold) painted on left wall, wicker basket filled with comfort items (stuffed animals weighted lap pad fidget toys), brave star reward chart with gold stickers on right wall, comfortable child-sized reclining chair in center with soft cushion, warm amber pendant lamp overhead, rounded child-safe furniture edges, gentle clinical design with encouraging warm colors, 4:3 aspect ratio, no people, no text`

(14) `exposure_child_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm amber and golden accents, upgraded child exposure therapy room, tablet on adjustable arm stand for virtual exposure exercises on desk at left, expanded comfort corner with weighted blankets quilted throw pillows and noise-canceling headphones at right, child-sized relaxation station with breathing exercise poster and belly-breathing pillow, improved step-by-step visual guide cards laminated and clipped to wire above desk, warm amber and cream color scheme, 4:3 aspect ratio, no people, no text`

(15) `exposure_child_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm amber and golden accents, advanced child exposure therapy suite, child-friendly VR headset on padded stand with cartoon decals at front desk, two themed exposure practice chambers visible through glass doorways at back (one nature-themed one social-scenario themed), comprehensive star-and-badge reward system display board on right wall, biofeedback monitor with kid-friendly smiley-face interface on side table, zero-gravity child recliner in center, warm recessed lighting, golden and amber professional atmosphere, 4:3 aspect ratio, no people, no text`

(16) `exposure_child_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a child exposure therapy room, graduated step-ladder chart painted in rainbow colors on left wall with gold stars marking progress, comfortable child-sized recliner in center of room, comfort items basket with stuffed animals visible on floor beside chair, brave star reward chart on right wall, warm amber pendant lamp casting golden glow from above, rounded safe furniture, encouraging warm atmosphere, 4:3 aspect ratio, no people, no text`

### 5) 영양치료실 (nutrition_clinic)

(17) `nutrition_clinic.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm lime-green and cream accents, a nutrition therapy clinic for eating disorders, colorful healthy food pyramid poster and mindful eating infographic on lime-green accent wall, oval wooden meal planning table with portion-guide placemat in center, private weighing corner behind a cheerful floral curtain at back for discretion, small potted herb garden (basil mint) on windowsill, warm pendant lamp overhead, supportive non-judgmental design with body-positive affirmation cards on shelf, 4:3 aspect ratio, no people, no text`

(18) `nutrition_clinic_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm lime-green and cream accents, upgraded nutrition clinic, cooking therapy corner with child-safe utensils and mixing bowls on counter at left, small meal practice kitchenette with mini oven and colorful plates at back, body-positive artwork prints (diverse joyful figures) on walls, nutritional education display with food group models on shelf, improved private consultation nook with comfortable chair behind partition, warm natural light from window, 4:3 aspect ratio, no people, no text`

(19) `nutrition_clinic_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm lime-green and cream accents, premium nutrition therapy center, full therapeutic kitchen with stainless counter island and hanging copper pots at back, family meal practice dining table set with four place settings and linen napkins in center, garden therapy windowsill overflowing with fresh herbs and cherry tomato plant, recipe card display rack on side wall, professional dietitian's desk with meal plan resources at left, warm overhead lighting and terra cotta floor tiles, comprehensive recovery-focused environment, 4:3 aspect ratio, no people, no text`

(20) `nutrition_clinic_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a nutrition clinic, oval meal planning table with colorful placemat and food diary worksheet in mid-ground, healthy food pyramid poster and mindful eating infographic on lime-green wall at back, small herb garden on windowsill catching afternoon light at right, body-positive affirmation cards displayed on shelf at left, warm pendant lamp glowing overhead, supportive and non-judgmental atmosphere, no focus on weight or body shape, 4:3 aspect ratio, no people, no text`

### 6) 위기개입실 (crisis_room)

(21) `crisis_room.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm coral-red and soft cream accents, a crisis intervention room for youth, padded soft walls upholstered in warm salmon-pink fabric, wicker basket filled with calming sensory tools (stress balls fidget spinners textured rings) on low shelf, laminated safety plan poster with rainbow border on wall, two large bean bag chairs in coral and cream, small de-escalation space with floor cushions in corner, warm ceiling lamp with dimmer, NOT scary, safe haven design for emotional regulation, 4:3 aspect ratio, no people, no text`

(22) `crisis_room_lv2.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm coral-red and soft cream accents, upgraded crisis room, expanded sensory modulation tools on wall-mounted organizer including chew necklaces and hand exercisers, stack of weighted blankets and compression vests in cubby at left, calming ocean-wave light projector mounted on ceiling casting gentle blue ripples, red direct-line phone on side table for emergency contact, enhanced padded wall panels with fabric texture, soft carpet underfoot, safety and comfort focused, 4:3 aspect ratio, no people, no text`

(23) `crisis_room_lv3.webp`
: `soft watercolor illustration, bright cheerful pastel palette, child-friendly interior design, warm coral-red and soft cream accents, advanced crisis intervention suite, full multi-sensory regulation room with fiber-optic ceiling stars and bubble tube column in corner, discreet real-time vital-sign monitoring screen with gentle smiley-face interface on wall, two separate cool-down zones divided by a curved padded partition (one active one quiet), connection to emergency services panel with green-lit indicator by door, professional zero-gravity recliner in center, highest safety standards with rounded corners and magnetic door latch, 4:3 aspect ratio, no people, no text`

(24) `crisis_room_interior.webp`
: `soft watercolor illustration, bright cheerful pastel palette, wide interior view as if looking through a doorway into a crisis room, two coral bean bag chairs on soft carpet in mid-ground, basket of sensory tools (stress balls fidget toys) on low shelf at left, padded salmon-pink walls with laminated safety plan poster visible at back, calming ocean-wave projector casting gentle blue ripples on ceiling, small de-escalation cushion nook in far corner, warm overhead lamp with dimmer set to low glow, atmosphere of safety containment and warmth, NOT scary, 4:3 aspect ratio, no people, no text`

---

## 10. 영유아 시설 일러스트 (20개: 기본 5 + Lv.2 5 + Lv.3 5 + 내부 5)

> 기본/Lv: `public/assets/facilities-infant/`
> 내부: `public/assets/facilities-infant/interior/`
> 크기: 512×384px

### 1) 영유아 놀이실 (infant_play)

(1) `infant_play.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, baby pink and mint accents, an infant developmental play room, thick interlocking soft foam mat floor in pastel pink and cream, baby-safe developmental toys (stacking rings nesting cups soft blocks) arranged on low open shelving, large safety mirror at toddler height on left wall, whimsical cloud-and-star mobile hanging from ceiling, rounded wooden activity cube in center, pastel pink accent wall with hand-painted bunny and bear mural, gentle diffused warm light from overhead rice-paper lantern, safe nurturing environment for ages 1-5, 4:3 aspect ratio, no people, no text`

(2) `infant_play_lv2.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, baby pink and mint accents, upgraded infant play room, expanded developmental toy collection on double-wide shelving with picture labels, cause-and-effect toy station (pop-up toys bead maze musical buttons) on low table at left, imitation play corner with child-sized wooden kitchen set and pretend food at back right, improved thick wall padding in soft pink fabric, additional hanging mobile with felt animals, cushioned floor mat with alphabet pattern, warm overhead pendant in daisy shape, 4:3 aspect ratio, no people, no text`

(3) `infant_play_lv3.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, baby pink and mint accents, premium infant developmental play suite, multiple themed play zones separated by low padded arches — sensory zone at left with textured wall panels, imaginative play zone at center with dress-up mirror and toy kitchen, water play station with shallow tray and waterproof mat at right, natural material sensory corner with wooden bowls pinecones and fabric swatches, large garden-view window flooding room with soft morning light, highest quality developmental environment with Montessori-inspired open shelving, 4:3 aspect ratio, no people, no text`

(4) `infant_play_interior.webp`
: `soft watercolor illustration, soft dreamy pastel palette, wide interior view as if looking through a doorway into an infant play room, interlocking foam mat floor in pastel pink and cream stretching across the room, colorful cloud-and-star mobiles hanging from ceiling in mid-ground, low open shelving with stacking toys and soft blocks at back wall, safety mirror reflecting soft light on left, rounded wooden activity cube on floor in center, warm morning sunlight streaming through sheer curtains on right window, hand-painted bunny mural visible on far wall, nurturing gentle atmosphere, 4:3 aspect ratio, no people, no text`

### 2) 감각통합실 (sensory_room)

(5) `sensory_room.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, lavender and purple accents, a sensory integration room, tall acrylic bubble tube column with rising colored bubbles glowing blue and purple at left, textured tactile wall panels (furry smooth bumpy ribbed) at child height on back wall, suspended bolster therapy swing hanging from reinforced ceiling mount in center, small ball pit corner with pastel-colored balls at right, soft color-changing LED strips along ceiling edges casting gentle purple glow, thick padded mat floor, therapeutic calming sensory environment, 4:3 aspect ratio, no people, no text`

(6) `sensory_room_lv2.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, lavender and purple accents, upgraded sensory room, expanded swing collection including wide platform swing and cocoon swing hanging side by side from ceiling, fiber-optic starlight ceiling panel twinkling above, vibrating massage cushion station on padded platform at left, scent therapy corner with lavender and vanilla diffusers on low shelf at right, additional tactile wall panels including water-bead window and mirror tiles, color-changing bubble tubes now flanking both sides, purple and lilac dreamy atmosphere, 4:3 aspect ratio, no people, no text`

(7) `sensory_room_lv3.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, lavender and purple accents, premium multisensory Snoezelen environment, interactive light-up LED floor tiles that glow when stepped on, gentle projection mapping on curved walls showing slow-moving underwater scenes with fish and bubbles, full Snoezelen features including waterbed mattress fiber-optic curtain and rotating mirror ball, professional-grade suspended sensory integration equipment (trapeze bar and bolster swing) at ceiling, sound system playing gentle nature sounds, ultimate sensory paradise in purple and lavender, 4:3 aspect ratio, no people, no text`

(8) `sensory_room_interior.webp`
: `soft watercolor illustration, soft dreamy pastel palette, wide interior view as if looking through a doorway into a sensory room, suspended therapy swing hanging from ceiling in center of room, tall bubble tube columns glowing blue-purple light flanking the sides, textured tactile wall panels at child height visible on back wall, small ball pit with pastel balls in far corner, soft padded mat floor throughout, fiber-optic ceiling lights twinkling like stars overhead, calm dreamy purple-toned atmosphere, 4:3 aspect ratio, no people, no text`

### 3) 부모코칭실 (parent_coaching)

(9) `parent_coaching.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, warm peach-orange and cream accents, a parent coaching room, large one-way observation mirror in oak frame dominating left wall showing a colorful child play space on the other side, small wireless earpiece set on cushioned tray on side table, comfortable upholstered viewing armchair facing the mirror, low bookshelf with parent coaching guides and handout folders at right, warm peach accent wall, soft overhead lighting, professional parent-child interaction coaching environment, 4:3 aspect ratio, no people, no text`

(10) `parent_coaching_lv2.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, warm peach-orange and cream accents, upgraded parent coaching room, live video feed system with mounted camera above observation mirror and monitor on adjustable arm at desk, split-screen coaching display showing two camera angles, improved wireless earpiece set in charging dock on side table, expanded parent resource library shelf with categorized binders and pamphlets, comfortable two-seater sofa facing mirror, warm pendant lamp, 4:3 aspect ratio, no people, no text`

(11) `parent_coaching_lv3.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, warm peach-orange and cream accents, advanced parent coaching suite, multi-camera observation system with three mounted cameras and wide-screen monitor wall showing different angles of child play room, real-time behavioral coding display on tablet with color-coded interaction graphs at desk, recording and playback station with headphones and touchscreen for session review, comprehensive parent training library wall at back, ergonomic coaching chair with side table and notepad, professional warm lighting, 4:3 aspect ratio, no people, no text`

(12) `parent_coaching_interior.webp`
: `soft watercolor illustration, soft dreamy pastel palette, wide interior view as if looking through a doorway into a parent coaching room, large one-way observation mirror on left wall showing a bright colorful play space beyond, comfortable armchair facing the mirror in mid-ground, small earpiece on cushioned tray on side table, parent coaching guide bookshelf at back right, warm peach-orange walls, soft pendant lamp casting warm glow from above, warm supportive atmosphere designed for guided parent-child bonding, 4:3 aspect ratio, no people, no text`

### 4) 언어치료실 (language_lab)

(13) `language_lab.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, cyan and soft blue accents, a speech and language therapy room, laminated picture communication cards (PECS) pinned in rows on a cyan felt board on back wall, AAC tablet device propped on small child-height table in center, wooden bookshelf filled with colorful board books and picture storybooks at right, small recording microphone on desk for articulation practice, acoustic foam panels in soft blue on side walls, alphabet train wall border at toddler height, warm overhead light, child-friendly design for language development, 4:3 aspect ratio, no people, no text`

(14) `language_lab_lv2.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, cyan and soft blue accents, upgraded language therapy lab, interactive touchscreen word board mounted at child height on left wall showing colorful vocabulary categories, expanded AAC device collection (two tablets and a button communicator) on charging station, small puppet theater with fabric curtain for narrative therapy practice at back, sound-dampened recording booth with glass window visible at right corner, expanded picture book library with reading cushion, cyan and cream color scheme, 4:3 aspect ratio, no people, no text`

(15) `language_lab_lv3.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, cyan and soft blue accents, premium language therapy center, large screen displaying speech analysis software with colorful waveform visualizations on front wall, comprehensive AAC technology wall with multiple devices mounted for demonstration at left, immersive storytelling corner with canopy reading tent fairy lights and storybook display rack at right, professional speech pathology articulation mirror and tongue-placement charts on desk, directional microphone and audio playback headphones, advanced language development sanctuary in soft cyan and blue, 4:3 aspect ratio, no people, no text`

(16) `language_lab_interior.webp`
: `soft watercolor illustration, soft dreamy pastel palette, wide interior view as if looking through a doorway into a language therapy room, small child-height table with AAC tablet device and picture cards spread out in mid-ground, PECS communication board pinned with laminated cards on cyan felt board at back wall, bookshelf of colorful picture books at right, acoustic foam panels in soft blue on walls, alphabet train border at toddler height, warm overhead light illuminating the space evenly, engaging and nurturing atmosphere for language development, 4:3 aspect ratio, no people, no text`

### 5) 구조화교실 (structured_teaching)

(17) `structured_teaching.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, soft blue and white accents, a TEACCH structured teaching classroom, laminated visual schedule strip (pictogram cards top-to-bottom) mounted on left wall, three individual work stations with wooden dividers creating private cubicles in a row, color-coded labeled bins and task trays on shelving at back, clear spatial organization with taped boundary lines on light-blue floor, "finished" basket at end of each station, visual timer on desk, calm orderly blue-toned professional space designed for predictability, 4:3 aspect ratio, no people, no text`

(18) `structured_teaching_lv2.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, soft blue and white accents, upgraded structured teaching classroom, five expanded individual work stations with adjustable-height dividers, digital visual schedule system on mounted tablet showing animated pictogram sequence at front wall, token economy reward display board with Velcro star chart and prize photos at right, improved visual support cards laminated and clipped to stations, additional group instruction area with small table and two chairs, soft blue and cream orderly atmosphere, 4:3 aspect ratio, no people, no text`

(19) `structured_teaching_lv3.webp`
: `soft watercolor illustration, soft dreamy pastel palette, nurturing infant-safe interior design, soft blue and white accents, advanced TEACCH and ABA structured teaching center, multiple specialized zones — independent work zone with cubicle stations at left, one-on-one instruction table at center, leisure/reward zone with soft seating at right, comprehensive visual support systems including digital schedule wall and social story display, data collection tablet on therapist desk with behavioral charts, professional-grade task analysis bins and first-then boards throughout, calm focused and highly organized blue-toned environment, 4:3 aspect ratio, no people, no text`

(20) `structured_teaching_interior.webp`
: `soft watercolor illustration, soft dreamy pastel palette, wide interior view as if looking through a doorway into a structured teaching classroom, three individual work stations with wooden dividers in a row at mid-ground, laminated visual schedule strip on left wall showing pictogram sequence, color-coded labeled task bins on shelving at back wall, visual timer and "finished" basket visible on nearest station, taped boundary lines on light-blue floor, soft natural light from window on right, calm predictable and orderly atmosphere, 4:3 aspect ratio, no people, no text`

---

## 11. 성인 시설 내부 일러스트 (6개)

> 경로: `public/assets/facilities/interior/`
> 크기: 512×384px

### 1) 상담 모달 미리보기용

(1) `individual_room_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of a one-on-one counseling room, two plush armchairs facing each other with a small round wooden coffee table between them, warm floor lamp casting golden glow on left side, tall bookshelf filled with psychology textbooks on back wall, potted monstera plant in corner, tissue box and water glass on table, soft beige carpet, afternoon sunlight through sheer curtains on right window, cozy professional therapy atmosphere, muted teal and warm brown color scheme, 4:3 aspect ratio, no people, no text`

(2) `group_room_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of a group therapy circle room, eight cushioned chairs arranged in a perfect circle on a soft gray carpet, large whiteboard on back wall with colorful sticky notes, flip chart easel in corner, soft pendant lights hanging from ceiling, motivational artwork on side walls, large window with natural light, warm communal atmosphere, muted violet and cream color scheme, 4:3 aspect ratio, no people, no text`

(3) `exposure_lab_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of an exposure therapy laboratory, graduated difficulty chart on wall showing 10 steps from easy to hard, VR headset station on a clean desk, heart rate monitor on side table, comfortable reclining chair in center, calming blue LED strip along ceiling edge, observation window with one-way mirror on left wall, organized clinical equipment, supportive clinical atmosphere, muted amber and white color scheme, 4:3 aspect ratio, no people, no text`

(4) `mindfulness_room_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of a mindfulness meditation sanctuary, five round meditation cushions (zafu) arranged on tatami-style floor, small bamboo water fountain on stone pedestal in corner, singing bowl and incense holder on low wooden shelf, natural skylight in ceiling casting soft beam of light, indoor zen rock garden along one wall, hanging macrame plant holders with trailing pothos, peaceful serene atmosphere, muted teal and natural wood color scheme, 4:3 aspect ratio, no people, no text`

(5) `family_room_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of a family therapy room, large L-shaped comfortable sofa in warm cream fabric, children's play corner with small table and crayons on lower right, family photo display concept on shelf (blank frames), soft area rug with geometric pattern, warm pendant lamp overhead, toy basket visible, bookshelf with parenting guides and picture books, warm homey yet professional atmosphere, muted rose-pink and warm beige color scheme, 4:3 aspect ratio, no people, no text`

(6) `activity_room_interior.webp`
: `soft watercolor illustration, gentle pastel palette, warm kawaii-adjacent style, wide interior view of an activity therapy room, art supplies station with easels and paint jars on left side, music corner with acoustic guitar on stand and small djembe drum on right, yoga mats rolled up in basket near window, creative expression wall covered in colorful abstract art pieces, large windows with bright natural light, wooden floor with paint splatter marks adding character, energetic yet therapeutic atmosphere, muted green and warm yellow color scheme, 4:3 aspect ratio, no people, no text`

---

## 12. 아동 층 배경 (5개)

> 경로: `public/assets/floors-child/`
> 크기: 1920×1080px (16:9)

### 1) 아동센터 층

(1) `child_garden.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, bright cheerful pastel palette, a sky playground rooftop space for recovered children (EM 0~20), brilliant blue sky with fluffy cumulus clouds stretching to the horizon, rainbow-colored curved slide and wooden climbing structure with safety netting at center, raised colorful flower beds bursting with sunflowers daisies and lavender along the edges, children's vegetable garden patch with small watering cans, painted butterflies and dragonflies on the low perimeter wall, warm golden afternoon sunlight casting long soft shadows, amber-yellow and sky-blue color scheme, bunting flags fluttering in gentle breeze, wooden benches with cushions, joyful healing atmosphere of freedom and accomplishment, no people, no text`

(2) `child_comfort.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, bright cheerful pastel palette, a cozy counseling hallway for children (EM 21~40), soft violet-lavender walls with hand-painted constellation and moon mural stretching along the corridor, comfortable built-in reading nooks with arched alcoves and plush cushions tucked into the walls, shelves lined with stuffed animals (bears rabbits cats) at child height, warm fairy-light strings draped along the ceiling in star patterns, thick cream carpet floor with purple runner, soft wall sconces casting warm amber pools of light, small potted ferns on windowsills, framed children's positive-affirmation artwork, safe nurturing atmosphere of gentle encouragement, no people, no text`

(3) `child_care.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, bright cheerful pastel palette, a children's care center corridor (EM 41~60), sky-blue painted walls with white cloud stencils near the ceiling, school-like but warmer atmosphere with colorful therapy room doors (each a different pastel — coral mint amber) with hand-lettered room-name signs and picture symbols, children's artwork displayed in clip frames along both walls, large windows on right letting in bright natural daylight, polished light-wood flooring with blue rubber safety strips, small potted plants on windowsills, notice board with schedule cards and star charts, organized and cheerful therapeutic learning environment, no people, no text`

(4) `child_intensive.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, bright cheerful pastel palette, an intensive care center for children (EM 61~80), warm orange accent walls with a large calming ocean and whale mural painted floor-to-ceiling on the main wall, professional but child-friendly design with specialized therapy room doorways visible along the corridor, structured environment with clearly labeled visual-schedule strips beside each door, padded bench seating with orange and cream cushions along one side, soft overhead pendant lamps in frosted glass casting even warm light, rubber safety flooring in warm amber tones, small aquarium built into wall niche with tropical fish, atmosphere of focused professional care with warmth, no people, no text`

(5) `child_shelter.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, bright cheerful pastel palette, a protective treatment center for children (EM 81~100), soft red-coral walls with maximum safety design — all corners padded with rounded foam bumpers in matching coral fabric, cozy protected alcove spaces with canopy curtains and floor cushions for de-escalation tucked into wall niches, warm glowing mushroom-shaped night-light lamps mounted at intervals along the corridor casting soft amber pools, thick padded carpet floor in deep rose, sensory fidget panels mounted at child height, soft weighted blankets folded on shelving, atmosphere of absolute safety warmth and gentle containment, no people, no text`

---

## 13. 영유아 층 배경 (4개)

> 경로: `public/assets/floors-infant/`
> 크기: 1920×1080px (16:9)

### 1) 영유아센터 층

(1) `infant_bloom.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, soft dreamy pastel palette, a blooming playroom for toddlers (EM 0~25), soft sage-green walls with hand-painted wildflower mural — daisies tulips and dandelion puffs stretching across the entire back wall, hanging colorful felt mobiles (butterflies birds flowers) suspended from ceiling at different heights gently turning, thick interlocking soft foam mat floor in pastel green and cream, large arched windows on right flooding the room with warm morning sunlight through sheer white curtains, potted nursery plants (spider plants and small ferns) on low safe shelves, wooden Montessori climbing arch in corner, scattered soft fabric building blocks on floor, ceiling painted as a blue sky with small white clouds, magical garden-like atmosphere of growth and wonder, no people, no text`

(2) `infant_nurture.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, soft dreamy pastel palette, a warm nurturing care room for infants (EM 26~50), soft rose-pink walls with delicate hand-painted cherry blossom branch mural along the top border, two wooden rocking chairs with knitted cushions on left, cozy floor cushion corners with oversized round pillows in rose and cream arranged along walls for parent-child bonding, ceiling painted as a gentle night sky with tiny LED fiber-optic stars twinkling softly, warm fleece blankets in blush pink draped over the backs of chairs, soft indirect warm lighting from wall sconces shaped like crescent moons, thick padded cream carpet floor, wooden mobile with felt hearts and stars above a reading nook, womb-like safe atmosphere of tender comfort, no people, no text`

(3) `infant_care.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, soft dreamy pastel palette, a developmental support center for toddlers (EM 51~75), soft baby-blue walls with a friendly hand-painted hot-air balloon and cloud mural, developmental assessment tools neatly arranged on low open shelving — stacking cups shape sorters and bead mazes with picture labels, educational play stations with child-height tables and tiny chairs in pastel blue and white, large wall-mounted developmental milestone chart with colorful pictograms, height-appropriate rounded furniture throughout, large window letting in bright gentle daylight, light wooden floor with soft blue area rugs, small sensory light table in corner, organized stimulating and professionally warm environment, no people, no text`

(4) `infant_cocoon.webp`
: `wide panoramic watercolor illustration, 16:9 aspect ratio, soft dreamy pastel palette, a safe cocoon sanctuary for infants (EM 76~100), soft purple-lavender walls with a hand-painted sleeping owl and starlit forest mural, nest-like enclosed pod spaces with padded canopy hoods lined in soft fleece along the walls for sensory retreat, folded weighted blankets in lavender and cream visible on low shelves, gentle heartbeat-rhythm warm pulsing from recessed wall lights that slowly brighten and dim like breathing, thick ultra-soft foam floor in pale lilac, hanging felt cloud mobile with trailing ribbons from ceiling center, sound machine speaker shaped like a sleeping bear on shelf, maximum comfort protection and womb-like enveloping safety, no people, no text`

---

## 14. 센터 외관 (6개)

> 경로: `public/assets/building/`
> 크기: 800×600px (4:3)

### 1) 평판 등급별 건물

(1) `center_f.webp`
: `soft watercolor illustration, gentle pastel palette, a small dilapidated counseling office building — F-rank reputation (무명 상담소), old two-story residential house converted to office with crumbling beige plaster walls and visible cracks, faded hand-painted sign on the door barely readable, overgrown weeds and dandelions pushing through cracked concrete path, rusty metal handrail on three front steps, single dim warm window light glowing on the second floor, overcast rainy gray sky with drizzle, puddles reflecting the building, a few scattered autumn leaves on the ground, sad but not hopeless — a spark of potential visible in that one lit window, humble beginnings in a quiet Korean residential neighborhood, 4:3 aspect ratio, no text, no people`

(2) `center_d.webp`
: `soft watercolor illustration, gentle pastel palette, a clean small commercial building used as a counseling center — D-rank reputation (동네 치료실), single-story white-painted storefront with a new but modest rectangular sign reading in Korean, tidy glass entrance door with one terracotta potted plant beside it, freshly swept sidewalk, simple awning over the door, small window with sheer curtain, partly cloudy sky with patches of blue beginning to show, quiet Korean neighborhood street with a utility pole and a parked bicycle nearby, maintained and dignified despite its small scale, early morning light with a hint of warmth breaking through clouds, 4:3 aspect ratio, no text, no people`

(3) `center_c.webp`
: `soft watercolor illustration, gentle pastel palette, a two-story counseling center building — C-rank reputation (지역 상담센터), bright clean cream-and-teal exterior with large windows on both floors, professional illuminated sign with a heart-and-hand logo above the entrance, small garden area with wooden bench under a young cherry tree on the left, flower beds of marigolds and lavender lining a paved stone pathway to the front door, planter boxes on second-floor windowsills, blue sky with friendly white cumulus clouds, warm midday sunlight, established community center atmosphere in a Korean urban neighborhood, welcoming and trustworthy, 4:3 aspect ratio, no text, no people`

(4) `center_b.webp`
: `soft watercolor illustration, gentle pastel palette, a modern three-story healing center — B-rank reputation (유명 치유센터), contemporary glass-and-warm-wood facade with clean architectural lines, LED-illuminated center name sign glowing teal above a wide glass entrance lobby, decorative stone water fountain with gentle cascading water at the courtyard center, professionally landscaped gardens with trimmed hedges and seasonal flower beds flanking the entrance path, warm brass exterior sconce lights, large ground-floor windows revealing a bright welcoming interior, sunset golden-hour lighting casting long warm shadows and painting the building in orange and gold, prestigious therapy center in a Korean city setting, 4:3 aspect ratio, no text, no people`

(5) `center_a.webp`
: `soft watercolor illustration, gentle pastel palette, a magnificent four-story healing center with a lighthouse tower element — A-rank reputation (마음의 등대), modern Korean architecture blending warm wood cladding and floor-to-ceiling glass walls, a cylindrical lighthouse tower rising from the rooftop with a glowing warm-amber beacon light visible at its crown, beautiful rooftop garden with greenery spilling over the railing visible on the top floor, large welcoming entrance portico with a curving glass canopy and warm pendant lights, stone-paved courtyard with mature trees and decorative benches, golden-hour lighting with amber sky and soft lens flare from the beacon, established prestigious center radiating warmth and trust in a Korean cityscape, 4:3 aspect ratio, no text, no people`

(6) `center_s.webp`
: `soft watercolor illustration, gentle pastel palette, a magnificent lighthouse-inspired integrated healing center — S-rank reputation (통합발달치유원), grand five-story campus with three connected architectural wings (teal-accented adult wing on left, amber-accented child wing at center, pink-accented infant wing on right) joined by glass skywalks, a tall glowing lighthouse tower at the central junction with a brilliant warm beacon light illuminating the twilight sky, lush rooftop garden visible on each wing, glass-and-warm-wood contemporary Korean architecture, stone-paved entrance plaza with circular fountain and cherry blossom trees in bloom, starry deep-blue twilight sky with first stars appearing, golden light emanating warmly from every window, the ultimate integrated developmental healing center — a beacon of hope, 4:3 aspect ratio, no text, no people`

---

## 15. 업적 뱃지 아이콘 (26개)

> 경로: `public/assets/ui/`
> 크기: 128×128px (1:1 정사각형)
> 스타일: 원형 또는 방패형 뱃지 안에 심볼, 금/은/동 테두리

### 1) 성인 업적 (10개)

(1) `badge_first_treat.webp`
: `circular game achievement badge icon, polished golden metallic border with subtle bevel, center motif: a speech bubble containing a glowing pink heart symbol, warm amber background glow radiating outward, embossed shine on border edge, first counseling session achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(2) `badge_first_discharge.webp`
: `circular game achievement badge icon, polished golden metallic border with subtle bevel, center motif: an open arched doorway with brilliant golden sunlight rays streaming through, soft teal inner ring, embossed light effect on border, first patient discharge achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(3) `badge_facility_master.webp`
: `circular game achievement badge icon, polished silver metallic border with cool steel sheen, center motif: a crossed wrench and small building silhouette, soft blue background glow, embossed industrial detail on border, all facilities built achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(4) `badge_counselor_team.webp`
: `circular game achievement badge icon, polished golden metallic border with warm gleam, center motif: three human silhouettes standing in a circle holding hands, soft purple inner background glow, embossed laurel leaf detail on border, full counselor team achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(5) `badge_reputation_a.webp`
: `circular game achievement badge icon, polished golden metallic border with radiant gleam, center motif: a lighthouse tower with a brilliant shining beacon at the top emitting light rays, teal and gold gradient inner background, embossed wave pattern on border, A-rank reputation achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(6) `badge_100_treats.webp`
: `circular game achievement badge icon, polished golden metallic border with rich warm sheen, center motif: bold numeral "100" with a sparkling five-pointed star above it, warm gold and amber inner background glow, embossed dot pattern on border ring, hundred treatments milestone achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(7) `badge_zero_crisis.webp`
: `shield-shaped game achievement badge icon, polished silver metallic border with cool blue sheen, center motif: a shield with a bold checkmark symbol inside, soft steel-blue background glow, embossed rivet details on shield border edge, zero crisis record achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(8) `badge_all_issues.webp`
: `circular game achievement badge icon, iridescent rainbow-shifting metallic border with prismatic gleam, center motif: an eight-pointed star radiating in rainbow gradient colors (red orange yellow green blue indigo violet), soft white center glow, embossed faceted gem cuts on border, all issue types treated achievement, premium polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(9) `badge_economy_master.webp`
: `circular game achievement badge icon, polished golden metallic border with luxurious warm gleam, center motif: a stack of gold coins with a tiny crown perched on top, rich amber and gold inner background glow, embossed diamond pattern on border ring, financial mastery achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(10) `badge_lighthouse_guardian.webp`
: `shield-shaped game achievement badge icon, polished golden metallic border with premium radiant gleam, center motif: a lighthouse standing on a sea cliff with a small rainbow arching over it, gold purple and teal gradient inner background, embossed star and laurel wreath detail on border, ultimate adult-stage guardian achievement, premium polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

### 2) 아동 업적 (8개)

(11) `badge_first_child_discharge.webp`
: `circular game achievement badge icon, polished golden metallic border with warm gleam, center motif: a small child figure with outstretched butterfly wings spreading open in flight, warm yellow and teal gradient inner background glow, embossed petal pattern on border ring, first child discharge achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(12) `badge_play_power.webp`
: `circular game achievement badge icon, polished silver metallic border with soft shimmer, center motif: colorful stacked toy building blocks (red yellow blue) with sparkle stars above them, warm yellow and purple gradient inner background, embossed zigzag pattern on border ring, play therapy mastery achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(13) `badge_parent_partner.webp`
: `circular game achievement badge icon, polished golden metallic border with tender warm gleam, center motif: a large hand gently holding a small child's hand interlinked, soft green and gold gradient inner background glow, embossed vine-and-leaf pattern on border ring, parent partnership achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(14) `badge_school_expert.webp`
: `circular game achievement badge icon, polished silver metallic border with cool sheen, center motif: a small school building silhouette with a shining gold star above its roof, soft blue and silver gradient inner background, embossed book-spine pattern on border ring, school consultation expert achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(15) `badge_child_specialist.webp`
: `shield-shaped game achievement badge icon, polished golden metallic border with warm radiance, center motif: a child silhouette standing inside a glowing protective circle with radiating light, warm orange and gold gradient inner background, embossed heart detail at shield top, child specialist center achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(16) `badge_crisis_guardian.webp`
: `shield-shaped game achievement badge icon, polished golden metallic border with strong warm gleam, center motif: a protective shield with a small human figure sheltered behind it, bold red and gold gradient inner background glow, embossed cross-hatch reinforcement pattern on border, crisis guardian for youth achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(17) `badge_rehabilitation.webp`
: `circular game achievement badge icon, polished golden metallic border with hopeful warm gleam, center motif: a winding path leading toward a brilliant sunrise on the horizon with golden rays fanning upward, warm orange and gold gradient inner background, embossed stepping-stone pattern on border ring, rehabilitation success achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(18) `badge_precise_diagnosis.webp`
: `circular game achievement badge icon, polished silver metallic border with analytical cool sheen, center motif: a magnifying glass hovering over a stylized brain symbol with a sparkle at the lens center, soft purple and silver gradient inner background, embossed circuit-line pattern on border ring, precise psychological assessment achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

### 3) 영유아 업적 (8개)

(19) `badge_first_milestone.webp`
: `circular game achievement badge icon, polished golden metallic border with gentle warm glow, center motif: a tiny baby footprint with a sparkling gold star rising above it, soft sage-green and gold gradient inner background, embossed dot-trail pattern on border ring, first developmental milestone achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(20) `badge_golden_time.webp`
: `shield-shaped game achievement badge icon, polished golden metallic border with rich lustrous gleam, center motif: an ornate hourglass with glowing golden sand flowing and a sparkling star at its center, warm gold and amber gradient inner background glow, embossed clock-tick marks on shield border, golden time guardian achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(21) `badge_developmental_miracle.webp`
: `circular game achievement badge icon, iridescent rainbow-shifting metallic border with prismatic sheen, center motif: a small green seedling growing and transforming into a full leafy tree with golden fruit, green-to-rainbow gradient inner background glow, embossed root-and-branch filigree on border ring, developmental miracle achievement, premium polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(22) `badge_parent_coach.webp`
: `circular game achievement badge icon, polished golden metallic border with nurturing warm gleam, center motif: a pair of large hands gently cupping and guiding two smaller child-sized hands reaching upward, warm orange and gold gradient inner background glow, embossed heart-chain pattern on border ring, parent coaching mastery achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(23) `badge_integration_master.webp`
: `shield-shaped game achievement badge icon, iridescent rainbow-shifting metallic border with premium prismatic gleam, center motif: three interconnected overlapping circles in teal amber and pink (representing adult child and infant centers) forming a triquetra-like symbol with a gold star at the intersection, rainbow-to-gold gradient inner background, embossed three-strand braid on border, integration master achievement, premium polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(24) `badge_voucher_expert.webp`
: `circular game achievement badge icon, polished golden metallic border with official warm gleam, center motif: a government voucher document scroll with a bold green checkmark stamp, soft blue and gold gradient inner background, embossed seal-and-ribbon pattern on border ring, voucher program expert achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(25) `badge_stress_resolver.webp`
: `circular game achievement badge icon, polished silver metallic border with transformative cool-to-warm sheen, center motif: a dark storm cloud on the left transforming into a bright sunshine on the right with golden rays, blue-to-warm-yellow gradient inner background showing the transition, embossed raindrop-to-sunburst pattern on border ring, parent stress resolver achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

(26) `badge_no_dispute.webp`
: `shield-shaped game achievement badge icon, polished golden metallic border with harmonious warm gleam, center motif: perfectly balanced golden scales with a small olive-branch peace symbol resting at the fulcrum, soft gold and sage-green gradient inner background glow, embossed laurel wreath detail on shield border, zero dispute center achievement, polished game UI style, 1:1 square, clean transparent background, no text, no watermark`

---

## 16. 이벤트 일러스트 (17개)

> 경로: `public/assets/cutscenes/`
> 크기: 1280×720px (16:9)

### 1) 성인 이벤트 (5개)

(1) `event_guardian_visit.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a parent/guardian visiting a counseling center lobby, foreground: a middle-aged parent in a neat coat standing at the reception counter with a concerned worried expression clutching a small handbag, midground: a friendly receptionist behind the desk gesturing toward the consultation area with a reassuring smile, background: the warm interior of the counseling center lobby with potted plants on windowsill and a framed calming landscape on the teal-accent wall, warm overhead pendant lighting casting golden glow, soft afternoon light through glass entrance door on left, family support theme with gentle empathetic atmosphere, Korean counseling center setting, no text, no watermark`

(2) `event_media_coverage.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a media coverage event at a counseling center, foreground: a journalist in business casual holding a notepad with a curious friendly expression and a camera operator beside them with a shoulder-mounted camera, midground: center staff standing at the building entrance — the director smiling with a mix of nervousness and pride, a therapist adjusting their lanyard, background: the counseling center exterior with its professional sign visible, microphone boom visible at top edge, late morning bright daylight, Korean urban neighborhood setting, professional and slightly exciting atmosphere, no text, no watermark`

(3) `event_counselor_burnout.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a therapist experiencing compassion fatigue, foreground: a therapist sitting alone at their desk, head resting in both hands, shoulders slumped, glasses pushed up, expression of deep exhaustion, midground: the desk cluttered with a tall stack of case files open folders and an empty coffee cup, a single dim warm desk lamp the only light source casting long shadows, background: the empty darkened office at night — bookshelves in shadow, window showing dark blue night sky with city lights, chair slightly askew, empathetic and respectful depiction of professional burnout, no text, no watermark`

(4) `event_patient_conflict.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a patient conflict in a group therapy room, foreground: two adult patients sitting in chairs with tense body language — one with crossed arms and averted gaze the other with clenched fists on knees, abstract wavy tension lines floating in the air between them in warm amber tones, midground: a therapist standing between them with palms open in a calm mediating gesture and a professional composed expression, background: the group therapy room with other empty chairs in a circle whiteboard on wall, overhead pendant lights, professional conflict resolution scene — NOT violent, muted violet and warm tones, no text, no watermark`

(5) `event_donation.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a donation ceremony at a counseling center, foreground: a generous donor in smart business attire presenting an oversized ceremonial check to the smiling center director who receives it with both hands and a grateful bow, midground: three staff members clapping enthusiastically behind them, a small congratulatory banner hung across the wall, background: the bright counseling center lobby with reception desk plants and warm lighting, golden warm celebratory atmosphere, confetti-like sparkle accents floating in the air, Korean professional setting, no text, no watermark`

### 2) 아동 이벤트 (6개)

(6) `event_teacher_request.webp`
: `soft watercolor illustration, bright cheerful pastel palette, 16:9 aspect ratio, full-scene illustration of a school-center collaboration meeting, foreground: a school teacher with glasses holding a student folder open on the table with a concerned caring expression, midground: a child therapist sitting across the meeting table nodding attentively taking notes on a clipboard, a student's academic file and colorful artwork visible between them on the table, background: a bright consultation room with children's artwork on the walls a bookshelf of therapy resources and a window showing a school building in the distance, warm morning light from the right, professional collaborative atmosphere, Korean school setting details, no text, no watermark`

(7) `event_parent_anxiety.webp`
: `soft watercolor illustration, bright cheerful pastel palette, 16:9 aspect ratio, full-scene illustration of a worried parent in a children's center waiting room, foreground: a parent sitting on the edge of a waiting-room chair fidgeting hands clasped tightly looking down at a phone with an anxious worried expression, a tissue crumpled in one hand, midground: a therapist approaching from the hallway with a gentle reassuring smile and open palm gesture, background: the bright cheerful waiting room with children's drawings on walls potted plant by the window colorful chairs and a toy corner, soft overhead lighting, empathetic parent-support moment, no text, no watermark`

(8) `event_child_friendship.webp`
: `soft watercolor illustration, bright cheerful pastel palette, 16:9 aspect ratio, full-scene illustration of a spontaneous friendship moment in a children's center, foreground: two children (age 8-10) sitting cross-legged on the hallway floor facing each other with excited delighted expressions, one sharing a sticker sheet while the other shows a colorful drawing, midground: scattered crayons and stickers on the floor between them, a dropped school bag nearby, background: the bright child center hallway with sky-blue walls colorful room doors and children's artwork displayed in frames, warm natural daylight streaming from a window at the end of the hall, bright cheerful joyful atmosphere, no text, no watermark`

(9) `event_sns_criticism.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of an online criticism incident at a counseling center, foreground: a staff member sitting in the break room looking at a phone screen with a worried distressed expression furrowed brows, abstract dark-tinted speech bubble shapes with frown-face icons floating upward from the phone representing negative comments, midground: two supportive colleagues approaching from behind — one placing a comforting hand on the first person's shoulder the other offering a cup of tea, background: the staff break room with a bulletin board coffee machine and window showing daylight, muted blue-gray tense atmosphere softened by the warm support gesture, no text, no watermark`

(10) `event_academic_invitation.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a career milestone for a therapist, foreground: a therapist sitting at their neat desk opening a formal invitation letter with both hands eyes wide with proud excited surprise and a growing smile, midground: the desk with the opened envelope a framed certificate on the wall and a coffee cup, an academic conference poster with a podium graphic pinned to the bulletin board behind, background: the therapist's office with bookshelves of professional texts a potted plant on the windowsill warm afternoon sunlight from the left, hopeful career-growth atmosphere with warm golden tones, no text, no watermark`

(11) `event_abuse_suspicion.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a mandatory reporting dilemma, foreground: a child therapist sitting at their desk in deep contemplation — chin resting on clasped hands eyes downcast with a heavy serious expression, midground: on the desk a child's crayon drawing showing a concerning scene (abstract — dark heavy scribbles not explicit), a desk phone positioned nearby with the receiver slightly lifted suggesting the decision to call, a printed reporting protocol sheet partially visible, background: the quiet office with dimmed warm desk lamp a bookshelf and a window showing gray overcast sky reflecting the somber mood, respectful serious tone — no explicit abuse depiction, heavy moral responsibility moment, no text, no watermark`

### 3) 영유아 이벤트 (6개)

(12) `event_gov_funding.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of a government funding partnership event, foreground: a government official in a formal dark suit presenting a funding approval document with official seal to the center director who accepts it with a respectful bow and grateful smile, their hands meeting in a professional handshake, midground: a conference table with official letterhead papers a pen set and two cups of tea, a small Korean flag on the table, background: a bright meeting room with certificates framed on the wall a potted orchid on a sideboard and tall windows letting in warm morning light, professional positive support atmosphere, no text, no watermark`

(13) `event_parent_burnout.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of parent caregiver fatigue at an infant center, foreground: an exhausted parent dozing in a waiting-room armchair head tilted back eyes closed with dark circles visible, a large overstuffed baby diaper bag slumped on the floor beside their feet, midground: a kind therapist approaching from the right carrying a warm cup of tea on a small tray with a gentle caring expression and soft footsteps, background: the infant center waiting room with soft pink walls a small play corner with foam toys a window showing afternoon light, warm and empathetic atmosphere — tender support moment highlighting caregiver burden, no text, no watermark`

(14) `event_dev_assessment.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of a developmental assessment session, foreground: a clinical psychologist in professional attire seated at a low child-height table with colorful developmental testing materials spread out — stacking blocks picture cards and a small puzzle, midground: a toddler (age 2-3 with chubby cheeks) sitting across the table reaching for a block with curious concentration, a parent observing from a chair slightly behind and to the right with an attentive hopeful expression, background: the bright assessment room with developmental milestone charts on the wall a shelf of standardized testing kits and soft natural light from a window, professional and nurturing atmosphere, no text, no watermark`

(15) `event_sibling_jealousy.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of a sibling jealousy moment at an infant center, foreground: an older sibling (age 5-7) standing alone in the center hallway looking downward with a sad lonely expression, arms hanging at sides, a small toy clutched in one hand, midground: a parent visible through an open doorway carrying a younger toddler into the bright therapy room, the parent's attention fully on the younger child, background: the infant center hallway with soft pink walls cheerful artwork and warm overhead lighting contrasting with the child's solitary sadness, tender family dynamics scene about the pain of feeling overlooked, no text, no watermark`

(16) `event_milestone_celebration.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of a developmental milestone celebration, foreground: a toddler (age 2-3) clapping tiny hands happily with a huge delighted smile, sitting on the floor surrounded by colorful confetti, midground: center staff and parents gathered around — a therapist holding a small "congratulations" certificate with a star sticker two parents beaming with tearful pride, pastel balloons (pink mint lavender) floating above, background: the bright infant center room decorated with a simple party banner hand-painted streamers and soft warm lighting, joyful achievement celebration atmosphere with warmth and happy tears, no text, no watermark`

(17) `event_waitlist_complaint.webp`
: `soft watercolor illustration, soft dreamy pastel palette, 16:9 aspect ratio, full-scene illustration of a waitlist complaint at an infant center, foreground: a frustrated parent leaning on the reception counter with a tense expression gesturing with one hand while the other holds a squirming toddler on their hip, midground: the receptionist behind the desk with an apologetic sympathetic expression palms open in an "I understand" gesture, a computer screen and appointment book visible on the desk, background: several other families sitting in the waiting area — some looking at phones some bouncing babies, the waiting room with soft pink walls and a crowded feel, atmosphere of service demand and overwhelm balanced with empathy, no text, no watermark`

---

## 17. 인트로 컷씬 (4개)

> 경로: `public/assets/cutscenes/`
> 크기: 1280×720px (16:9)

### 1) 게임 시작 인트로 4페이지

(1) `intro_page1.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, bird's eye view establishing shot of a small struggling counseling center in a busy Korean city, foreground: a bustling sidewalk with pedestrians walking past, each person trailing heavy dark watercolor shadows beneath them representing the invisible weight of emotional burden, midground: one person has stopped in the crowd and is turning to look at the center's dim flickering sign — a moment of recognition and hope, the small center is a converted residential building with a single warm window glowing, background: a dense Korean urban cityscape with apartment buildings and neon signs, the sky above is a gradient from deep indigo night on the left to soft rose-gold dawn on the right suggesting a new beginning, warm vs cool color tension throughout, no text, no watermark`

(2) `intro_page2.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, abstract metaphorical visualization of Emotional Mass (EM), left side of frame: a small human figure hunched and struggling under a massive dark crimson-red sphere on their shoulders — the sphere heavy cracked and radiating dark energy representing psychological burden, center: the same figure mid-stride as the sphere shrinks and lightens through abstract therapy imagery (small glowing hands books gentle light touching the sphere), right side: the figure standing tall and free arms spread wide carrying only a tiny bright teal orb now luminous and weightless, background: gradient wash from dark burgundy-red on left through purple in center to bright teal-green on right, floating abstract particles transitioning from heavy dark to light sparkles, no text, no watermark`

(3) `intro_page3.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, evidence-based therapy methods showcase in four glowing panels arranged in a 2x2 grid, top-left panel glowing warm amber: a CBT whiteboard with a cognitive triangle diagram drawn on it and a pointer, top-right panel glowing deep violet: a classic psychodynamic therapy chaise longue with a notepad and an open book, bottom-left panel glowing soft teal: a DBT emotion regulation skills worksheet with a mindfulness candle and breathing exercise diagram, bottom-right panel glowing warm rose: a family therapy circle of chairs with a genogram chart on an easel, each panel has its own distinct color glow bleeding softly at the edges, the panels float on a dark scholarly background with subtle molecular/neural network patterns, scientific yet warm and human atmosphere, no text, no watermark`

(4) `intro_page4.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, timeline progression showing the counseling center's growth journey reading from left to right, far left: a tiny run-down office building in gray rain with one person entering, center-left: a growing two-story building with a small garden and three staff members welcoming patients, center-right: a modern three-story center with landscaped gardens multiple therapists visible through windows and families in the courtyard, far right: a magnificent lighthouse-topped building glowing with golden light, a beacon shining upward into a brilliant sunset sky, progressively more people are shown healed and happy as the building grows, the ground transitions from cracked pavement to blooming flower fields, golden hour lighting intensifying from left to right, journey of growth hope and healing, no text, no watermark`

---

## 18. 엔딩 컷씬 (2개)

> 경로: `public/assets/cutscenes/`
> 크기: 1280×720px (16:9)

### 1) 엔딩 장면

(1) `ending_a.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, triumphant ending scene — "Friend of Children" (아동의 벗), foreground: a group of diverse children and teenagers (ages 7-17) standing happily in a row in front of the counseling center — some waving at the viewer some holding hands some making peace signs, their expressions radiating joy confidence and gratitude, midground: therapists in professional attire and proud smiling parents standing behind the children with arms gently on shoulders, a hand-painted congratulations banner strung above the entrance, background: the beautiful two-story counseling center building bathed in warm golden sunset light, Korean cherry blossom (벚꽃) petals falling gently through the air like pink snow, a clear golden-orange sky with a few luminous clouds, the center's sign glowing warmly, emotional triumphant atmosphere of accomplishment and love, no text, no watermark`

(2) `ending_s.webp`
: `cinematic watercolor illustration, 16:9 aspect ratio, ultimate ending scene — "Light of Integrated Healing" (통합 치유의 빛), foreground: a large crowd of healed people of all ages — adults teenagers children and toddlers with parents — gathered together looking up at the building with expressions of gratitude and wonder, some holding candles or lanterns, midground: the magnificent three-wing integrated center building glowing brilliantly — teal light emanating from the adult wing on the left amber light from the child wing at center and soft pink light from the infant wing on the right, background: the three colored beams of light converging upward into a single brilliant golden beacon at the top of the lighthouse tower, Korean-style fireworks (폭죽) bursting in gold and silver across a deep starry twilight sky, cherry blossom and flower petals swirling in the air, the building radiating warmth like a living lighthouse, the emotional peak moment of the entire game, no text, no watermark`

---

## 19. 게임오버 일러스트 (2개)

> 경로: `public/assets/cutscenes/`
> 크기: 1280×720px (16:9)

### 1) 게임오버 장면

(1) `gameover_bankrupt.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a counseling center closure due to bankruptcy, foreground: the last staff member — a therapist in a slightly wrinkled coat — walking through the front door carrying a cardboard box of personal belongings (a framed photo a coffee mug a small plant), one hand on the door frame for a final look back, midground: the empty dark counseling room visible through the doorway — therapy chairs stacked against the wall lights off a dust-covered reception desk, a handwritten "임대문의" (FOR LEASE) sign taped to the inside of the window, background: a rainy gray street outside with puddles reflecting the dim building, overcast sky with heavy clouds, a single street lamp casting cold blue light, melancholic but NOT hopeless atmosphere — a small green sprout growing from a crack in the pavement near the door suggesting the possibility of trying again, no text, no watermark`

(2) `gameover_trust_lost.webp`
: `soft watercolor illustration, gentle pastel palette, 16:9 aspect ratio, full-scene illustration of a counseling center losing its community's trust, foreground: several former patients walking away in a solemn line toward the distant horizon along a long empty road, their backs to the viewer some with lowered heads, midground: the counseling center building still standing but visibly empty — all windows dark no lights inside, the entrance sign hanging slightly crooked, wilting potted plants and scattered dry leaves at the doorstep, a forgotten umbrella leaning against the wall, background: a vast cloudy overcast sky in muted blue-gray with a thin line of distant light at the horizon suggesting that somewhere else there might still be hope, the building stands alone, bittersweet and melancholic but treated with dignity and respect, no text, no watermark`

---

## 20. UI 아이콘 (3개)

> 경로: `public/assets/ui/`
> 크기: 128×128px (1:1 정사각형)

### 1) 리소스 아이콘

(1) `icon_gold.webp`
: `polished game UI icon, a shiny golden coin with an engraved heart symbol in center, raised metallic bevel edge with subtle shadow, warm amber glow radiating outward, two small sparkle stars at upper-left and lower-right, pixel-art adjacent clean flat style, clean transparent background, 1:1 square, game currency icon, no text, no watermark`

(2) `icon_ap.webp`
: `polished game UI icon, a bright electric-blue lightning bolt with three small sparkle effects at the tips, energetic action point symbol, vivid cyan-to-blue gradient fill, soft electric glow halo radiating behind the bolt, subtle motion lines suggesting energy, pixel-art adjacent clean flat style, clean transparent background, 1:1 square, game energy icon, no text, no watermark`

(3) `icon_reputation.webp`
: `polished game UI icon, a golden five-pointed star centered inside a circular golden laurel wreath, warm rich gold gradient fill on the star with embossed edge detail, soft warm golden glow radiating outward from behind the wreath, tiny sparkle at the star's top point, prestige and reputation symbol, pixel-art adjacent clean flat style, clean transparent background, 1:1 square, game reputation icon, no text, no watermark`

---

## 21. 아동 내담자 캐릭터 (24개)

> 경로: `public/assets/characters/patient-child/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가
> 스타일 앵커에 추가: `child/teenager character, 7-17 years old, school uniform or casual clothes`

### 1) 아동 불안 (child_anxiety)

(1) `child_anxiety_calm.webp`
: `soft watercolor illustration, kawaii style, child age 8-12, calm relaxed expression, sitting comfortably with hands on lap, school uniform, slight brave smile, soft teal ambient lighting, clean white background, child counseling center patient, feeling safe and relieved`

(2) `child_anxiety_neutral.webp`
: `soft watercolor illustration, kawaii style, child age 8-12, slightly nervous expression, clutching book bag strap, looking sideways with worried eyes, school uniform, blue-gray ambient lighting, clean white background, child counseling center patient, mild anxiety`

(3) `child_anxiety_distress.webp`
: `soft watercolor illustration, kawaii style, child age 8-12, distressed expression, hands covering ears, curled up posture, tears forming, school uniform rumpled, warm red ambient lighting, clean white background, child counseling center patient, anxiety overwhelm, depicted gently`

### 2) 청소년 우울 (child_depression)

(4) `child_depression_calm.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, gentle hopeful smile, sitting upright, casual hoodie, looking forward with clarity, soft teal ambient lighting, clean white background, teen counseling center patient, emerging from depression`

(5) `child_depression_neutral.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, head slightly lowered, hood partially up, earbuds hanging, dull tired expression, blue-gray ambient lighting, clean white background, teen counseling center patient, low mood`

(6) `child_depression_distress.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, deeply withdrawn, hood up covering most of face, knees drawn up, headphones as wall from world, warm red ambient lighting, clean white background, teen counseling center patient, severe depression, gentle respectful depiction`

### 3) ADHD (adhd)

(7) `adhd_calm.webp`
: `soft watercolor illustration, kawaii style, energetic child age 7-10, sitting still with proud concentration face, small fidget toy in hand, bright alert eyes focused forward, casual colorful clothes, soft teal ambient lighting, clean white background, child counseling patient, managing attention well`

(8) `adhd_neutral.webp`
: `soft watercolor illustration, kawaii style, energetic child age 7-10, looking in three different directions simultaneously, fidgety hands, bouncing in seat, scattered items around, blue-gray ambient lighting, clean white background, child counseling patient, attention scattered`

(9) `adhd_distress.webp`
: `soft watercolor illustration, kawaii style, energetic child age 7-10, overwhelmed expression, too many stimuli indicated by abstract swirling elements, covering head, frustrated tears, warm red ambient lighting, clean white background, child counseling patient, sensory and attention overload`

### 4) 행동조절 어려움 (behavior_regulation)

(10) `behavior_regulation_calm.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, calm composed expression, arms relaxed at sides, standing tall with self-control, casual clothes, soft teal ambient lighting, clean white background, child counseling patient, behavior well-regulated`

(11) `behavior_regulation_neutral.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, slightly clenched fists, tense jaw, trying to hold back frustration, restless stance, blue-gray ambient lighting, clean white background, child counseling patient, building anger`

(12) `behavior_regulation_distress.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, explosive frustrated expression but NOT violent, abstract red burst around figure as metaphor, stomping foot, tears of frustration, warm red ambient lighting, clean white background, child counseling patient, behavioral dysregulation, no actual violence depicted`

### 5) 아동 트라우마 (child_trauma)

(13) `child_trauma_calm.webp`
: `soft watercolor illustration, kawaii style, child age 8-14, sitting in warm sunlight, holding comfort object (stuffed animal), brave gentle smile, feeling safe expression, soft teal ambient lighting, clean white background, child counseling patient, healing from trauma`

(14) `child_trauma_neutral.webp`
: `soft watercolor illustration, kawaii style, child age 8-14, alert watchful eyes, clutching stuffed animal tightly, guarded posture, flinching slightly, blue-gray ambient lighting, clean white background, child counseling patient, hypervigilant`

(15) `child_trauma_distress.webp`
: `soft watercolor illustration, kawaii style, child age 8-14, hiding behind stuffed animal, wide frightened eyes visible above it, tiny curled up figure, warm red ambient lighting, clean white background, child counseling patient, trauma response, gentle and protective depiction, NOT scary`

### 6) 아동 강박 (child_ocd)

(16) `child_ocd_calm.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, relaxed expression, hands free and comfortable, messy-but-fine art project nearby showing flexibility, soft teal ambient lighting, clean white background, child counseling patient, freedom from compulsions`

(17) `child_ocd_neutral.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, organizing items meticulously, concentrated focused expression, slightly rigid posture, things need to be just right, blue-gray ambient lighting, clean white background, child counseling patient, OCD urges present`

(18) `child_ocd_distress.webp`
: `soft watercolor illustration, kawaii style, child age 9-13, distressed repetitive hand motion, items around them not aligned causing visible anxiety, strained expression, warm red ambient lighting, clean white background, child counseling patient, compulsive behavior escalating`

### 7) 섭식장애 (eating_disorder)

(19) `eating_disorder_calm.webp`
: `soft watercolor illustration, kawaii style, teenager age 13-17, calm at table with balanced meal, slight smile, comfortable relationship with food depicted, casual clothes, soft teal ambient lighting, clean white background, teen counseling patient, recovery progress, NO extreme thinness depicted`

(20) `eating_disorder_neutral.webp`
: `soft watercolor illustration, kawaii style, teenager age 13-17, uneasy expression looking at food, hands in lap hesitating, conflicted eyes, blue-gray ambient lighting, clean white background, teen counseling patient, food anxiety, normal body proportions, NO extreme thinness`

(21) `eating_disorder_distress.webp`
: `soft watercolor illustration, kawaii style, teenager age 13-17, turning away from food, hands covering face, tears, distressed relationship with meal, warm red ambient lighting, clean white background, teen counseling patient, eating distress, respectful depiction, NO extreme thinness or body shaming`

### 8) 정서위기 (emotion_crisis)

(22) `emotion_crisis_calm.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, calm centered expression, sitting in stable posture, emotional storm has passed, clear eyes looking forward, safety plan card visible in hand, soft teal ambient lighting, clean white background, teen counseling patient, stabilized after crisis`

(23) `emotion_crisis_neutral.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, intense turbulent expression, abstract ocean wave motif around figure representing emotional turbulence, gripping chair arms, blue-gray ambient lighting, clean white background, teen counseling patient, emotional escalation, metaphorical not literal`

(24) `emotion_crisis_distress.webp`
: `soft watercolor illustration, kawaii style, teenager age 14-17, overwhelmed by abstract emotional storm (swirling colors around figure), hunched over, abstract representation of emotional flooding, NO self-harm depicted, warm red ambient lighting, clean white background, teen counseling patient, emotional crisis as metaphorical storm`

---

## 22. 아동 상담사 캐릭터 (6개)

> 경로: `public/assets/characters/counselor-child/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 아동 전공별 상담사

(1) `child_cbt.webp`
: `soft watercolor illustration, kawaii style, young professional child therapist, holding cognitive behavioral therapy worksheet for kids with colorful illustrations, warm smile, casual professional attire with friendly lanyard, approachable for children, clean white background`

(2) `play_therapy.webp`
: `soft watercolor illustration, kawaii style, play therapist sitting on floor, surrounded by therapeutic toys and puppets, sand tray nearby, playful warm expression, comfortable play-friendly clothing with colorful apron, approachable and fun, clean white background`

(3) `parent_training.webp`
: `soft watercolor illustration, kawaii style, parent training specialist, holding parenting resource booklet, warm reassuring expression, sitting in welcoming posture, smart casual professional attire, trustworthy and supportive appearance, clean white background`

(4) `dbt_a.webp`
: `soft watercolor illustration, kawaii style, adolescent DBT therapist, holding emotion regulation skill cards, calm centered expression, balanced posture, professional but youth-friendly attire, mindful presence, clean white background`

(5) `tf_cbt.webp`
: `soft watercolor illustration, kawaii style, trauma-focused child therapist, gentle protective expression, holding safety plan with child-friendly illustrations, warm professional attire, creating safe space aura, clean white background`

(6) `family_therapy.webp`
: `soft watercolor illustration, kawaii style, family therapist, family therapy figurines set nearby, inclusive welcoming gesture, warm expression, professional attire with warm colors, family systems approach, clean white background`

---

## 23. 영유아 내담자 캐릭터 (18개)

> 경로: `public/assets/characters/patient-infant/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가
> 스타일 앵커에 추가: `toddler/infant character, age 1-5, soft round features, oversized head, chubby cheeks, very cute`

### 1) 자폐스펙트럼 조기 (asd_early)

(1) `asd_early_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-4, making gentle eye contact, slight smile, playing with toy functionally, round chubby features, oversized head, soft teal ambient lighting, clean white background, infant developmental center patient, connected and engaged`

(2) `asd_early_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-4, looking to the side avoiding eye contact, spinning a toy wheel repetitively, absorbed in own world expression, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient`

(3) `asd_early_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-4, covering ears, overwhelmed expression from sensory input, scrunched face, tears, warm red ambient lighting, clean white background, infant developmental center patient, sensory overwhelm, gentle depiction`

### 2) 발달지연 (dev_delay)

(4) `dev_delay_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, curious wide eyes exploring a developmental toy, happy engaged expression, reaching for colorful blocks, round chubby features, soft teal ambient lighting, clean white background, infant developmental center patient, learning and growing`

(5) `dev_delay_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, sitting with developmental toy, slightly confused expression trying to figure it out, looking at toy with concentration, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient`

(6) `dev_delay_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, frustrated with task too difficult, pushing toy away, crying face, round chubby features, warm red ambient lighting, clean white background, infant developmental center patient, frustration with developmental challenges`

### 3) 애착문제 (attachment)

(7) `attachment_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, reaching toward parent figure with joyful expression, secure attachment posture, arms up for hug, round chubby features, soft teal ambient lighting, clean white background, infant developmental center patient, secure bond`

(8) `attachment_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, ambivalent expression, half reaching toward and half pulling away, uncertain whether to approach, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient, insecure attachment`

(9) `attachment_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-3, crying and distressed when separated, reaching out desperately, anxious panicked face, round chubby features, warm red ambient lighting, clean white background, infant developmental center patient, attachment distress, gentle depiction`

### 4) 감각처리 어려움 (sensory)

(10) `sensory_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, happily touching different textures, curious exploring hands, content smile, sensory play, round chubby features, soft teal ambient lighting, clean white background, infant developmental center patient, sensory integration success`

(11) `sensory_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, cautiously touching new texture with one finger, uncertain hesitant expression, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient, sensory sensitivity`

(12) `sensory_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, pulling hands away from sensory input, scrunched face refusing to touch, overwhelmed by texture or sound, round chubby features, warm red ambient lighting, clean white background, infant developmental center patient, sensory avoidance`

### 5) 언어발달지연 (speech_delay)

(13) `speech_delay_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, mouth open forming words, excited expression at speaking, pointing at picture communication card, round chubby features, soft teal ambient lighting, clean white background, infant developmental center patient, language breakthrough`

(14) `speech_delay_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, gesturing and pointing instead of speaking, eager expression trying to communicate without words, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient, pre-verbal communication`

(15) `speech_delay_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 1-4, frustrated trying to speak, mouth open but struggling, tears of communication frustration, gesturing desperately, round chubby features, warm red ambient lighting, clean white background, infant developmental center patient, communication frustration`

### 6) 영유아 행동문제 (behavioral_infant)

(16) `behavioral_infant_calm.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-5, sitting calmly following instructions, well-regulated expression, waiting patiently, round chubby features, soft teal ambient lighting, clean white background, infant developmental center patient, good behavioral regulation`

(17) `behavioral_infant_neutral.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-5, starting to get restless, wiggly posture, pouting expression, building frustration, round chubby features, blue-gray ambient lighting, clean white background, infant developmental center patient, behavior escalating`

(18) `behavioral_infant_distress.webp`
: `soft watercolor illustration, ultra kawaii style, toddler age 2-5, full tantrum pose, lying on floor crying, arms and legs flailing, red-faced, round chubby features, warm red ambient lighting, clean white background, infant developmental center patient, tantrum, depicted as normal toddler behavior not scary`

---

## 24. 영유아 상담사 캐릭터 (5개)

> 경로: `public/assets/characters/counselor-infant/`
> 크기: 256×256px (1:1), 프롬프트 끝에 `, 1:1 square composition` 추가

### 1) 영유아 전공별 상담사

(1) `aba.webp`
: `soft watercolor illustration, kawaii style, ABA therapist, professional organized appearance, holding data collection clipboard, reinforcement tokens visible, structured and systematic pose, warm but professional smile, clean white background`

(2) `developmental.webp`
: `soft watercolor illustration, kawaii style, developmental play therapist, sitting cross-legged on floor, holding developmental toys, warm nurturing expression, comfortable play-appropriate clothing, ready to engage with toddlers at their level, clean white background`

(3) `attachment_therapy.webp`
: `soft watercolor illustration, kawaii style, attachment therapist, warm maternal/paternal presence, sitting between parent and child figures, coaching gesture, gentle calm expression, cozy professional attire, clean white background`

(4) `sensory_integration.webp`
: `soft watercolor illustration, kawaii style, sensory integration therapist, standing near therapy swing and sensory tools, active engaged posture, comfortable athletic-professional attire, holding textured ball, energetic but calm expression, clean white background`

(5) `speech_language.webp`
: `soft watercolor illustration, kawaii style, speech-language pathologist, holding picture communication cards and AAC device, expressive animated face demonstrating mouth movements, professional but child-friendly attire, sitting at child-height table, clean white background`

---

## 25. BGM 트랙 (7개)

> 경로: `public/assets/audio/bgm/`
> 포맷: MP3 또는 OGG (128kbps, 루프 재생용)
> 생성 도구: [Suno.ai](https://suno.ai) — 무료 티어
> 길이: **4분 (240초)** — 심리스 루프, OGG Vorbis 변환 시 ~2MB/곡

### 1) 메인 테마 / 스테이지별 BGM

(1) `main_theme.mp3`
**Suno 프롬프트**: `Gentle solo piano opens with a simple hopeful melody in C major, soft string ensemble joins at 0:30 adding warmth and depth, light harp arpeggios weave in at 1:00, the melody rises with added French horn at 1:30 for an emotional swell, a quiet bridge at 2:00 with solo cello and piano, builds again with full warm strings and glockenspiel accents at 2:30, reaches a tender climax at 3:00 then gently winds down to the opening piano motif, 90bpm medium tempo, Korean drama OST style, counseling center theme, like a lighthouse guiding lost souls, seamless loop point at 4:00, no vocals, 240 seconds`
**[Tags]**: `ambient, piano, orchestral, emotional, Korean OST, hopeful, instrumental, 90bpm`
**분위기**: 메인 메뉴 / 타이틀 화면 — 희망적이고 따뜻한 피아노+현악, 4분 풀 아크

(2) `adult_ambient.mp3`
**Suno 프롬프트**: `Lo-fi ambient Rhodes piano with warm jazzy seventh chords, soft vinyl crackle texture and distant rain on window, opens with simple two-chord progression, at 0:45 a mellow upright bass joins with a walking bass line, light brush drums enter at 1:15 with gentle ride cymbal, melody becomes slightly more complex at 2:00 with added ninth chords and a brief melodic flourish, 2:30 strip back to just Rhodes and rain for a quiet interlude, bass and brushes return at 3:00 with a new variation on the melody, gentle fade to match loop start at 4:00, 70bpm slow groove, calm professional therapy office atmosphere, no vocals, 240 seconds`
**[Tags]**: `lo-fi, jazz, ambient, piano, Rhodes, chill, rainy, instrumental, 70bpm`
**분위기**: 성인센터 — 차분한 Lo-fi 피아노, 전문적이고 안정적인 느낌

(3) `child_playful.mp3`
**Suno 프롬프트**: `Bright cheerful marimba plays a bouncy pentatonic melody, acoustic guitar strumming light eighth notes joins at 0:20, xylophone adds sparkly counter-melody at 0:45, a playful pizzicato string section enters at 1:00 for rhythmic bounce, the melody shifts to a new related theme at 1:30 with added tambourine and shaker, a brief gentle bridge at 2:00 with just guitar and soft wind chimes, full ensemble returns at 2:30 with ukulele joining for warmth, peak energy at 3:00 with all instruments and a clap pattern, gently winds down at 3:30 back to solo marimba, seamless loop at 4:00, 100bpm upbeat, children's therapy center atmosphere, safe and joyful, no vocals, 240 seconds`
**[Tags]**: `marimba, acoustic guitar, playful, children, xylophone, cheerful, instrumental, 100bpm`
**분위기**: 아동센터 — 밝고 활기찬 마림바+기타, 놀이와 안전의 공간

(4) `infant_gentle.mp3`
**Suno 프롬프트**: `Delicate music box melody in F major opens with a simple lullaby motif, soft harp arpeggios join at 0:30 with gentle ascending patterns, celesta adds twinkling notes at 1:00, a warm pad synth (strings-like) provides a soft bed from 1:15, the melody evolves with a tender second theme at 1:45 featuring solo flute, quiet interlude at 2:15 with just harp and distant soft chimes like a wind mobile, music box returns at 2:45 with celesta harmonies, the lullaby reaches its warmest point at 3:15 with all instruments in gentle unison, gradually thins to solo music box at 3:45, seamless loop at 4:00, very slow 60bpm, pastel dreamland nursery atmosphere, tender and nurturing, no vocals, 240 seconds`
**[Tags]**: `music box, harp, lullaby, celesta, nursery, gentle, dreamy, instrumental, 60bpm`
**분위기**: 영유아센터 — 오르골+하프의 부드러운 자장가 풍, 파스텔 느낌

(5) `crisis_tension.mp3`
**Suno 프롬프트**: `Opens with a low sustained cello drone and a heartbeat-like bass pulse at 60bpm, tense string tremolo enters at 0:30 in minor key building unease, tempo gradually increases to 80bpm by 1:00 with added viola ostinato pattern, dissonant piano clusters added sparingly at 1:30 for sharp accents, the tension peaks at 2:00 with full string section tremolo and timpani rumbles, a brief respite at 2:30 with solo oboe playing a worried melody over the bass pulse, tension rebuilds at 3:00 with added brass stabs and deeper cello, reaches maximum urgency at 3:30 then subsides to just heartbeat pulse and drone for loop at 4:00, NOT horror — concerned and urgent psychological crisis atmosphere, no vocals, 240 seconds`
**[Tags]**: `tension, strings, cello, suspense, atmospheric, minor key, cinematic, instrumental, 80bpm`
**분위기**: 위기 상황 (EM 높음) — 긴박한 현악 트레몰로, 공포가 아닌 걱정과 긴장

(6) `ending_hope.mp3`
**Suno 프롬프트**: `Opens quietly with solo piano playing a tender reflective melody in D major at 80bpm, strings gradually swell in at 0:30 adding emotional depth, tempo builds to 100bpm at 1:00 as full string section joins with a soaring counter-melody, French horn enters at 1:30 with a noble ascending theme, a powerful emotional bridge at 2:00 with piano and full orchestra in unison building toward the climax, triumphant brass fanfare at 2:30 with cymbal crashes and timpani — the peak emotional moment, a tender recall of the opening piano theme at 3:00 now supported by warm strings and glockenspiel, the music gradually settles into a warm glowing resolution at 3:30, ends on a sustained radiant major chord with soft harp at 4:00, Korean drama finale style, healing and achievement, cinematic tears of joy, no vocals, 240 seconds`
**[Tags]**: `orchestral, cinematic, triumphant, emotional, Korean drama, brass, piano, strings, 100bpm`
**분위기**: 엔딩 — 감동적 풀 오케스트라, 치유와 성취의 클라이맥스

(7) `gameover_sad.mp3`
**Suno 프롬프트**: `Solo piano in A minor, opens with a simple melancholic melody played slowly and deliberately at 55bpm, gentle rain ambiance layer underneath throughout, at 0:45 the melody repeats with slight harmonic variation adding suspended chords, a single solo cello joins at 1:30 playing a mournful counterpoint, the piano and cello reach a bittersweet peak at 2:00 with a brief modulation to relative major suggesting a flicker of hope, returns to minor at 2:30 with just piano again more sparse and reflective, at 3:00 the rain sound becomes slightly louder as the piano plays the final repetition of the melody slower and quieter, the last 30 seconds fade to just rain and a single sustained piano note dying away, sense of loss but also quiet dignity and the possibility of trying again, no vocals, 240 seconds`
**[Tags]**: `solo piano, melancholic, minor key, rain, bittersweet, sparse, reflective, instrumental, 55bpm`
**분위기**: 게임오버 — 슬프지만 다시 도전할 수 있다는 여운, 솔로 피아노

---

## 26. SFX 효과음 (12개)

> 경로: `public/assets/audio/sfx/`
> 포맷: MP3 또는 WAV (짧은 효과음, 0.5~3초)
> 생성 도구: [Mixkit.co](https://mixkit.co) / [Freesound.org](https://freesound.org) 무료 다운로드
> 참고: 절차적 합성(Web Audio)이 이미 구현되어 있으므로, 외부 파일은 품질 업그레이드용

### 1) UI/기본 효과음

(1) `click.mp3`
**검색어**: `soft UI click`, `button tap sound`, `gentle pop`
**Mixkit 추천**: "Software interface click" 또는 "Quick pop click"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/click/
**특징**: 50~100ms, 높은 톤의 부드러운 클릭, 반복 사용에 거슬리지 않는 것

(2) `turn_advance.mp3`
**검색어**: `turn notification chime`, `gentle two-tone ascending`
**Mixkit 추천**: "Message pop alert" 또는 "Notification bell"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/notification/
**특징**: 상승하는 두 음 (도→미), 200~300ms, 턴 진행을 알리는 맑은 차임

(3) `treat_complete.mp3`
**검색어**: `healing chime`, `positive feedback sound`, `therapy bell`
**Mixkit 추천**: "Correct answer tone" 또는 "Achievement bell"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/bell/
**특징**: 벨 소리 두 음, 300~500ms, 치료 완료의 부드러운 성공음

(4) `discharge.mp3`
**검색어**: `celebration fanfare short`, `victory jingle`, `level complete`
**Mixkit 추천**: "Game level complete" 또는 "Achievement unlocked"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/win/
**특징**: 밝은 3화음 팡파레, 500~800ms, 종결(퇴원)의 축하 느낌

(5) `crisis.mp3`
**검색어**: `warning alert tone`, `danger notification`, `urgent alarm soft`
**Mixkit 추천**: "Alert notification" 또는 "Error buzzer"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/alert/
**특징**: 낮은 경고음, 400~600ms, 공포스럽지 않은 긴급 알림 (사이렌 금지)

### 2) 건설/고용 효과음

(6) `build.mp3`
**검색어**: `construction complete`, `building placed`, `hammer build`
**Mixkit 추천**: "Wooden block placed" 또는 "Building block snap"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/construction/
**특징**: 짧은 해머/블록음, 200~300ms, 시설 건설 완료

(7) `hire.mp3`
**검색어**: `welcome chime`, `positive notification`, `new member jingle`
**Mixkit 추천**: "Welcome notification" 또는 "Positive interface beep"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/notification/
**특징**: 환영 차임 두 음, 300~400ms, 새 상담사 고용

### 3) 스테이지/특수 효과음

(8) `milestone.mp3`
**검색어**: `achievement sparkle`, `star collect`, `milestone reached`
**Mixkit 추천**: "Fairy magic sparkle" 또는 "Star rating"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/magic/
**특징**: 반짝이는 상승 3음, 400~600ms, 발달 이정표 달성

(9) `parent_meeting.mp3`
**검색어**: `doorbell chime`, `warm greeting tone`, `visitor arrival`
**Mixkit 추천**: "Door bell ding" 또는 "Warm welcome chime"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/bell/
**특징**: 따뜻한 벨 2음, 300ms, 부모면담/코칭 시작

(10) `assessment.mp3`
**검색어**: `pen writing sound`, `clipboard check`, `form complete`
**Mixkit 추천**: "Paper slide" 또는 "Pen writing scratch"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/paper/
**특징**: 펜 쓰는 소리+체크, 200~400ms, 심리검사 실시

(11) `stage_switch.mp3`
**검색어**: `elevator ding`, `floor change chime`, `transition whoosh`
**Mixkit 추천**: "Elevator arrival ding" 또는 "Scene transition"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/transition/
**특징**: 엘리베이터 4음 상승, 400~600ms, 센터 전환

(12) `achievement.mp3`
**검색어**: `trophy unlocked`, `grand achievement fanfare`, `badge earned`
**Mixkit 추천**: "Game bonus reached" 또는 "Achievement unlocked fanfare"
**Mixkit 검색**: https://mixkit.co/free-sound-effects/game/
**특징**: 화려한 팡파레 4음, 500~800ms, 업적 달성 축하

---

## 27. 환경음 루프 (9개)

> 경로: `public/assets/audio/ambient/`
> 포맷: MP3 또는 OGG (루프 재생용, 30~60초 심리스 루프)
> 생성 도구: [Freesound.org](https://freesound.org) (CC0/CC-BY 라이선스)
> 볼륨: BGM보다 낮게 (기본 0.2), 분위기 레이어링용

### 1) 성인센터 환경음

(1) `office_calm.mp3`
**Freesound 검색어**: `office ambience loop`, `quiet room tone`, `air conditioning hum`
**레이어 구성**: 레이어1 — 부드러운 에어컨/환기 팬 저주파 험(연속, 볼륨 0.3), 레이어2 — 멀리서 들리는 벽시계 초침 틱틱 (규칙적, 볼륨 0.15), 레이어3 — 간헐적으로 먼 복도 발소리 또는 문 여닫는 소리 (5~10초 간격, 볼륨 0.1)
**특징**: 조용한 사무실 톤, 차분한 성인 상담센터 분위기, 30초 심리스 루프
**라이선스**: CC0 추천

(2) `rain_window.mp3`
**Freesound 검색어**: `rain on window loop`, `gentle rain indoor`, `rainy day ambience`
**레이어 구성**: 레이어1 — 창문 유리에 떨어지는 빗방울 (연속, 중간 밀도, 볼륨 0.4), 레이어2 — 먼 천둥 없이 부드러운 빗줄기 배경 (연속 화이트노이즈, 볼륨 0.2), 레이어3 — 간헐적 처마 물방울 떨어지는 소리 (불규칙, 볼륨 0.1)
**특징**: 실내에서 듣는 편안한 비, 치료 세션 배경, 45초 심리스 루프
**라이선스**: CC0

(3) `garden_birds.mp3`
**Freesound 검색어**: `garden birds loop`, `birdsong gentle`, `outdoor garden ambience`
**레이어 구성**: 레이어1 — 2~3종 작은 새 지저귐(참새, 박새 등, 불규칙 패턴, 볼륨 0.35), 레이어2 — 부드러운 바람 소리 (연속, 약한 바람, 볼륨 0.2), 레이어3 — 먼 나뭇잎 바스락 (간헐적, 볼륨 0.1)
**특징**: 옥상정원(garden층) 전용, 회복과 자유의 공간, 40초 심리스 루프
**라이선스**: CC0

### 2) 아동센터 환경음

(4) `playground_indoor.mp3`
**Freesound 검색어**: `indoor playground ambience`, `children playing distant`, `kids activity room`
**레이어 구성**: 레이어1 — 먼 거리에서 들리는 아이들 웃음소리와 대화 (반향 있음, 볼륨 0.25), 레이어2 — 나무 블록 쌓고 무너지는 소리 (간헐적, 5~8초 간격, 볼륨 0.15), 레이어3 — 발소리와 작은 공 튀기는 소리 (불규칙, 볼륨 0.1)
**특징**: 아동센터 활기, 합성/연출 녹음 사용 (실제 아동 녹음 피할 것), 40초 심리스 루프
**라이선스**: CC0

(5) `school_hallway.mp3`
**Freesound 검색어**: `school corridor ambience`, `hallway quiet`, `educational environment`
**레이어 구성**: 레이어1 — 넓은 복도의 빈 공간 반향음 (연속 저주파 룸톤, 볼륨 0.2), 레이어2 — 먼 발소리 (고무신 또는 운동화, 간헐적 3~6초 간격, 볼륨 0.15), 레이어3 — 교실 문 여닫는 소리 (10~15초 간격, 볼륨 0.1), 레이어4 — 매우 먼 수업 종 소리 (30초 한 번, 볼륨 0.05)
**특징**: 학교 복도 느낌, 학교자문 분위기, 45초 심리스 루프
**라이선스**: CC0

(6) `nature_stream.mp3`
**Freesound 검색어**: `stream water loop`, `creek flowing gentle`, `forest stream`
**레이어 구성**: 레이어1 — 얕은 시냇물 졸졸 흐르는 물소리 (연속, 볼륨 0.35), 레이어2 — 부드러운 숲 바람 (연속, 약한 바람, 볼륨 0.15), 레이어3 — 간헐적 작은 물방울 튀는 소리 (돌에 부딪히는 물, 불규칙, 볼륨 0.1)
**특징**: 하늘놀이터(child_garden층) 전용, 자연 치유 분위기, 40초 심리스 루프
**라이선스**: CC0

### 3) 영유아센터 환경음

(7) `music_box.mp3`
**Freesound 검색어**: `music box melody loop`, `nursery music box`, `gentle lullaby box`
**레이어 구성**: 레이어1 — 오르골 멜로디 (단순한 8마디 자장가풍, 연속 반복, 볼륨 0.3), 레이어2 — 오르골 태엽 감는 미세한 기계음 (매 루프 시작점, 볼륨 0.05), 레이어3 — 매우 부드러운 룸톤 (따뜻한 저주파, 연속, 볼륨 0.1)
**특징**: 영유아센터 기본 환경음, 따뜻하고 안전한 느낌, 30초 심리스 루프
**라이선스**: CC0

(8) `soft_chimes.mp3`
**Freesound 검색어**: `wind chimes gentle loop`, `soft chimes ambient`, `peaceful bells`
**레이어 구성**: 레이어1 — 가느다란 금속 윈드차임 (바람에 의한 불규칙 3~5음 울림, 볼륨 0.25), 레이어2 — 부드러운 바람 (아주 약한 바람, 연속, 볼륨 0.15), 레이어3 — 간헐적 작은 크리스탈 벨 (10초 간격, 높은 톤, 볼륨 0.08)
**특징**: 꽃피는놀이방(infant_bloom층) 분위기, 평화로운 소리, 35초 심리스 루프
**라이선스**: CC0

(9) `heartbeat_womb.mp3`
**Freesound 검색어**: `heartbeat ambient loop`, `womb sounds`, `prenatal heartbeat gentle`
**레이어 구성**: 레이어1 — 편안한 느린 심장박동 (60bpm, 쿵-쿵 2박 패턴, 연속, 볼륨 0.3), 레이어2 — 자궁 내부를 연상시키는 저주파 물속 같은 포근한 험 (연속, 볼륨 0.2), 레이어3 — 매우 먼 머플드 외부 소리 (물속에서 듣는 듯한 먼 소음, 연속, 볼륨 0.05)
**특징**: 안전한둥지(infant_cocoon층) 전용, 자궁 내부 같은 포근함, 30초 심리스 루프
**라이선스**: CC0

---

## 총 에셋 수량 체크리스트

| # | 카테고리 | 수량 | 경로 |
|---|---------|------|------|
| 1 | 성인 내담자 캐릭터 | 21 | characters/patient/ |
| 2 | 성인 층 배경 | 2 | floors/ |
| 3 | 성인 치료중 포즈 (내담자) | 8 | characters/patient/poses/ |
| 4 | 성인 치료중 포즈 (상담사) | 6 | characters/counselor/poses/ |
| 5 | 성인 번아웃 상태 | 6 | characters/counselor/poses/ |
| 6 | 종결/사고 연출 | 2 | cutscenes/ |
| 7 | NPC 캐릭터 | 8 | characters/npc/ |
| 8 | 성인 시설 Lv.2/3 | 12 | facilities/ |
| 9 | 아동 시설 (기본+Lv+내부) | 24 | facilities-child/ |
| 10 | 영유아 시설 (기본+Lv+내부) | 20 | facilities-infant/ |
| 11 | 성인 시설 내부 | 6 | facilities/interior/ |
| 12 | 아동 층 배경 | 5 | floors-child/ |
| 13 | 영유아 층 배경 | 4 | floors-infant/ |
| 14 | 센터 외관 | 6 | building/ |
| 15 | 업적 뱃지 | 26 | ui/ |
| 16 | 이벤트 일러스트 | 17 | cutscenes/ |
| 17 | 인트로 컷씬 | 4 | cutscenes/ |
| 18 | 엔딩 컷씬 | 2 | cutscenes/ |
| 19 | 게임오버 일러스트 | 2 | cutscenes/ |
| 20 | UI 아이콘 | 3 | ui/ |
| 21 | 아동 내담자 캐릭터 | 24 | characters/patient-child/ |
| 22 | 아동 상담사 | 6 | characters/counselor-child/ |
| 23 | 영유아 내담자 캐릭터 | 18 | characters/patient-infant/ |
| 24 | 영유아 상담사 | 5 | characters/counselor-infant/ |
| 25 | BGM 트랙 | 7 | audio/bgm/ |
| 26 | SFX 효과음 | 12 | audio/sfx/ |
| 27 | 환경음 루프 | 9 | audio/ambient/ |
| | **이미지 총합** | **237** | |
| | **오디오 총합** | **28** | |
| | **전체 에셋** | **265** | |
