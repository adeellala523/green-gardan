import { Article, Author } from '../../types';

export const defaultAuthor: Author = {
  id: 'author-editorial',
  name: 'Green Garden Editorial Team',
  role: 'Horticultural Writers & UK Gardeners',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  bio: 'Our team comprises passionate British gardeners, allotment keepers, and horticulturalists sharing time-tested practical advice for gardens across England, Scotland, Wales, and Northern Ireland.'
};

export const gardeningTipsArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Essential Gardening Jobs to Do in a UK Spring Garden',
    slug: 'essential-gardening-jobs-uk-spring-garden',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'As daylight hours lengthen and British soil begins to warm, early spring is the pivotal moment to wake up borders, prepare seedbeds, and tackle pruning before vigorous growth kicks in.',
    featuredImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb228cc?auto=format&fit=crop&w=1200&q=80',
    altText: 'Gardener preparing organic spring garden bed with hand fork in the UK',
    author: defaultAuthor,
    publishDate: '2026-03-12',
    updatedDate: '2026-04-02',
    readingTime: '6 min read',
    tags: ['Spring Jobs', 'Pruning', 'Soil Preparation', 'Beginners', 'UK Gardening'],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    seoTitle: 'Essential UK Spring Gardening Jobs: March to May Checklist',
    metaDescription: 'Step-by-step checklist of vital gardening jobs to carry out in a UK garden during spring. From border tidying to seed sowing and late frost precautions.',
    focusKeyword: 'UK spring gardening jobs',
    canonicalUrl: '/gardening-tips/essential-gardening-jobs-uk-spring-garden',
    faqs: [
      {
        question: 'When is it safe to plant out tender annuals in the UK?',
        answer: 'Tender plants like cosmos, dahlias, and tomatoes should remain sheltered until the risk of late spring frost has completely passed. In southern England, this is usually mid-May; in northern England and Scotland, wait until late May or early June.'
      },
      {
        question: 'Should I cut back all ornamental grasses in early spring?',
        answer: 'Deciduous grasses (like Miscanthus and Calamagrostis) should be sheared down to a few inches above ground level before fresh green shoots emerge. Evergreen grasses (such as Festuca or Carex) simply need dead foliage combed out with gloved fingers.'
      }
    ],
    content: `
## Welcoming the British Springtime into Your Garden

Spring in the United Kingdom is a time of swift transformation. The damp, chilly days of February yield to budding daffodils, emerging herbaceous perennials, and the irresistible urge to step out into the soil. However, unpredictable British weather—characterised by sudden showers and biting overnight frosts—demands a measured approach.

Tackling the right tasks between March and May lays the foundation for a vibrant display of blooms and heavy summer harvests. Here is our authoritative, step-by-step seasonal guide for British gardeners.

---

## 1. Border Maintenance and Soil Preparation

Before rushing to buy tender nursery plants, direct your attention to the soil. After a winter of rain and cold compaction:

- **Clear winter debris:** Rake away sodden fallen leaves and dead perennial stems. Take care to leave a discreet pile in an undisturbed corner for overwintering beneficial insects, including ladybirds and solitary bees.
- **Tackle early perennial weeds:** Young dandelions, hairy bittercress, and nettles draw nutrients swiftly once temperatures top 8°C. Lift them by their taproots before they form seedheads.
- **Top-dress with peat-free mulch:** Spread a generous 5–7cm blanket of well-rotted garden compost, leaf mould, or organic manure across all exposed borders. This locks in moisture, improves heavy UK clay drainage, and boosts microbial life without disturbing delicate bulb shoots.

---

## 2. Smart Spring Pruning

Timing is critical when pruning in the UK spring. Pruning too early can expose cut stems to freezing frost injury, while pruning too late sacrifices flower buds:

1. **Bush and climbing roses:** Cut stems back just above an outward-facing bud. Remove dead, diseased, or crossing wood to improve air circulation and prevent black spot.
2. **Summer-flowering shrubs:** Shrubs that flower on new wood, such as *Buddleja davidii* (butterfly bush) and *Hydrangea paniculata*, can be cut hard back in March.
3. **Cornus and Salix:** If you grow dogwoods or willows for their vivid winter stems, stool them back to a low woody base so they can produce fresh, brightly coloured stems for next winter.

---

## 3. Lawn Care: Gentle Awakening

Avoid setting your lawnmower to its lowest height on the first cut. After months of moss-friendly dampness:

- Wait for a dry day when the ground is not waterlogged or spongy underfoot.
- Give the lawn a light trim using the mower's highest blade setting.
- Scarify gently with a spring-tine rake to pull up excess thatch and moss, then aerate compacted areas with a garden fork.

---

## 4. Protecting Against the Inevitable Late Frosts

Never let a mild April afternoon deceive you into leaving tender seedlings unprotected. Keep plenty of horticultural fleece or cloches to hand. If local forecasts predict clear skies and sub-zero temperatures, quickly cover emerging potato shoots, hydrangea flower buds, and newly bedded seedlings.
    `
  },
  {
    id: 'art-2',
    title: 'How to Improve Garden Soil Naturally in the UK',
    slug: 'how-to-improve-garden-soil-naturally',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'Whether you battle dense London clay or thin chalky South Downs gravel, understanding natural soil conditioning will transform your plant vigour and moisture retention.',
    featuredImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    altText: 'Rich dark organic soil held in hands in a British allotment garden',
    author: defaultAuthor,
    publishDate: '2026-03-05',
    updatedDate: '2026-03-28',
    readingTime: '7 min read',
    tags: ['Soil Improvement', 'Composting', 'Organic Gardening', 'Clay Soil'],
    isFeatured: true,
    isPopular: true,
    status: 'published',
    seoTitle: 'How to Improve Garden Soil Naturally: UK Organic Guide',
    metaDescription: 'Learn how to improve British clay, sandy, or chalky garden soils naturally using homemade compost, green manures, leaf mould, and no-dig techniques.',
    focusKeyword: 'improve garden soil naturally UK',
    canonicalUrl: '/gardening-tips/how-to-improve-garden-soil-naturally',
    faqs: [
      {
        question: 'How do I test my garden soil type at home?',
        answer: 'Take a moist handful of garden soil and squeeze it. If it forms a shiny, sticky ball that holds its shape tightly, it is predominantly clay. If it crumbles loosely and feels gritty, it is sandy. If it fizzes slightly when exposed to vinegar, you likely have alkaline chalk or limestone.'
      },
      {
        question: 'Is the no-dig method better than rotary tilling?',
        answer: 'Yes, for most home borders and raised beds, no-dig preserves delicate fungal networks (mycorrhizae), protects earthworm channels, and suppresses buried weed seeds from germinating upon exposure to sunlight.'
      }
    ],
    content: `
## Why Soil Health is the Secret to British Gardening Success

Every seasoned UK gardener knows that healthy plants begin beneath your boots. Our island possesses a remarkably diverse geological patchwork—from the notoriously heavy London and Midlands clay to the dry, stony chalk soils of Wiltshire and the acidic peat of the Scottish Highlands.

Attempting to force plants into poorly conditioned soil inevitably leads to stunted roots, summer drought stress, and winter root rot. Fortunately, nature provides all the tools needed to establish fertile, crumbly loam.

---

## 1. Understanding Your Soil Profile

Before applying amendments, identify your foundation:

- **Heavy Clay Soil:** Holds immense nutrient stores but turns into unworkable glue during wet winters and bakes into concrete during hot July dry spells.
- **Sandy & Gravelly Soil:** Drains instantly and warms quickly in early spring, but leaches nutrients with every heavy rainfall.
- **Chalky & Limestone Soil:** Shallow and distinctly alkaline (high pH), often locking away iron and manganese and requiring plants adapted to lime.

---

## 2. The Universal Miracle: Well-Rotted Organic Matter

No matter which soil type sits in your garden, the remedy is identical: copious quantities of organic matter.

1. **Homemade Garden Compost:** Decomposed vegetable peelings, lawn clippings, shredded cardboard, and plant trimmings introduce millions of beneficial microorganisms.
2. **Autumn Leaf Mould:** Fallen oak, beech, and birch leaves rotted down over two years yield a friable, pH-neutral conditioner that supercharges soil structure.
3. **Mushroom Compost or Farmyard Manure:** Adds nitrogen and organic bulk, but ensure animal manure is rotted for at least six months to avoid scorching delicate roots.

---

## 3. The Power of the No-Dig Approach

Pioneered in the UK by market gardeners like Charles Dowding, the "no-dig" method saves your back while protecting soil ecology. Rather than digging down with heavy spade work:

- Spread an annual 5cm layer of compost on top of borders and vegetable patches each autumn or early spring.
- Earthworms and microscopic nematodes carry the organic matter down through the subsoil layers.
- Weed seeds buried deep below remain dormant in the dark, drastically cutting your weeding chores.

---

## 4. Growing Autumn Green Manures

If you have empty vegetable beds after harvesting runner beans and potatoes, never leave the bare soil exposed to winter rains. Sow winter green manures such as **Field Beans**, **Hungarian Grazing Rye**, or **Phacelia**. In spring, chop them back before flowering and let them enrich the topsoil with natural nitrogen.
    `
  },
  {
    id: 'art-3',
    title: "A Beginner's Guide to Growing Vegetables in the UK",
    slug: 'beginners-guide-growing-vegetables-uk',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'Starting your first kitchen garden is deeply satisfying. Discover which crops thrive in the British climate and how to avoid the most common beginner pitfalls.',
    featuredImage: 'https://images.unsplash.com/photo-1594488518042-4f367e9f6515?auto=format&fit=crop&w=1200&q=80',
    altText: 'Freshly harvested homegrown beetroot and carrots from a UK vegetable patch',
    author: defaultAuthor,
    publishDate: '2026-02-20',
    updatedDate: '2026-03-15',
    readingTime: '8 min read',
    tags: ['Grow Your Own', 'Vegetables', 'Allotment', 'Kitchen Garden'],
    isFeatured: false,
    isPopular: true,
    status: 'published',
    seoTitle: "Beginner's Guide to Growing Vegetables in the UK | Green Garden",
    metaDescription: "The ultimate beginner's guide to growing vegetables in the UK. Discover foolproof crops, planting calendars, sunlight requirements, and slug protection.",
    focusKeyword: 'growing vegetables UK beginners',
    canonicalUrl: '/gardening-tips/beginners-guide-growing-vegetables-uk',
    faqs: [
      {
        question: 'What are the easiest vegetables for UK beginners to start with?',
        answer: 'Radishes, salad leaves (cut-and-come-again), runner beans, Swiss chard, courgettes, and early seed potatoes are remarkably reliable in UK conditions.'
      },
      {
        question: 'Do I need a greenhouse to grow vegetables in Britain?',
        answer: 'Not at all! While a greenhouse or cold frame helps extend the season for tomatoes, peppers, and cucumbers, hardy staples like brassicas, roots, beans, and alliums thrive outdoors in open ground or raised beds.'
      }
    ],
    content: `
## Discovering the Joy of Homegrown Produce

There is no culinary comparison between supermarket produce and a crisp heritage carrot pulled straight from damp garden earth or a sweet pea popped fresh from its pod. For novice gardeners across the UK, growing your own vegetables ("GYO") is one of the most rewarding pursuits you can undertake.

The British climate—characterised by temperate summers and generous rainfall—is well-suited to a huge array of delicious crops if you work alongside the seasons.

---

## 1. Choosing the Optimal Location

Most vegetables require a minimum of 5 to 6 hours of direct sunlight each day. Look at your garden layout:

- **Sunniest Aspect:** Reserve south or west-facing corners for sun-worshippers like climbing beans, tomatoes, and courgettes.
- **Part Shade:** Brassicas (kale, cabbage), beetroot, radishes, and leafy salad greens tolerate partial afternoon shade and won't bolt as quickly during brief UK summer heatwaves.
- **Wind Protection:** Cold easterly spring winds can stunt growth; plant behind a sturdy trellis or boundary fence.

---

## 2. Foolproof Starter Crops for British Gardens

If you are planting your first raised bed or container patch, start with these resilient champions:

1. **Cut-and-Come-Again Salad Leaves:** Ready to harvest within 3 to 4 weeks of sowing. Snip the outer leaves and they will continue producing for months.
2. **Early Seed Potatoes:** Plant tubers like 'Charlotte' or 'Rocket' in March or April. They are fun to harvest and rarely suffer from late-season blight.
3. **Courgettes:** Two plants will yield more tender courgettes than an average family can eat between July and September.
4. **Runner Beans:** Vigorous climbers with delightful scarlet flowers that pollinators adore, providing kilos of pods throughout late summer.

---

## 3. Protecting Your Crops from the UK Slug Threat

Ask any allotment holder about their chief adversary, and the answer is always slugs and snails during wet British springs. Use these organic deterrence strategies:

- Use wool pellets or sharp grit rings around young emerging seedlings.
- Apply biological nematodes (*Phasmarhabditis hermaphrodita*) in mid-spring when soil temperatures rise above 5°C.
- Water beds in the early morning rather than evening, so surface soil dries out before nocturnal slugs venture forth.
    `
  },
  {
    id: 'art-4',
    title: 'How Often Should You Water Your Garden? The UK Water Guide',
    slug: 'how-often-should-you-water-your-garden-uk',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'Avoid shallow daily sprinkling that leads to weak surface roots. Learn the golden rules of deep watering, rainwater harvesting, and drought resilience.',
    featuredImage: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=1200&q=80',
    altText: 'Watering can pouring water onto garden perennials in early morning sunlight',
    author: defaultAuthor,
    publishDate: '2026-02-10',
    updatedDate: '2026-03-01',
    readingTime: '5 min read',
    tags: ['Watering', 'Drought Care', 'Water Butt', 'Sustainability'],
    isFeatured: false,
    isPopular: false,
    status: 'published',
    seoTitle: 'How Often to Water Your Garden in the UK: Complete Guide',
    metaDescription: 'Discover the exact watering schedule for UK gardens. Learn how to water containers, lawns, and borders efficiently to promote deep roots and save water.',
    focusKeyword: 'how often water garden UK',
    canonicalUrl: '/gardening-tips/how-often-should-you-water-your-garden-uk',
    faqs: [
      {
        question: 'What is the best time of day to water in the UK?',
        answer: 'Early morning is best. The soil is cool, so less water is lost to evaporation, and plant foliage dries off quickly in daylight, reducing fungal mildew risk.'
      },
      {
        question: 'Should I water my lawn during a dry summer spell?',
        answer: 'Established UK lawns rarely need watering during dry spells. While grass may turn brown and enter dormancy during July and August, it turns lush and green again within days of the first autumn rains.'
      }
    ],
    content: `
## Smarter Watering for British Gardens

Despite the UK's international reputation for ceaseless rain, regional precipitation varies dramatically. Parts of East Anglia and the South East receive less annual rainfall than Rome or Beirut, and regional hosepipe bans have become regular summer occurrences.

Watering effectively is not about daily sprinkles; it is about training plant roots to search deep into the soil.

---

## 1. The Rule: Water Deeply, Less Frequently

A light splash with the hose every evening is one of the most harmful gardening habits. It only moistens the top half-inch of soil, encouraging root systems to stay near the surface where they quickly scorch when the midday sun appears.

- **Established Perennials & Shrubs:** Give plants a thorough drenching once or twice a week during dry periods rather than a daily splash.
- **Aim at the Base:** Always direct water at the base of the stems, right onto the root zone, rather than soaking the leaves.
- **Check Soil Moisture First:** Push your index finger 5cm into the soil. If it feels cool and damp, step away from the watering can.

---

## 2. Container and Hanging Basket Demands

Pots and hanging baskets are closed systems that dry out rapidly in warm breezes:

1. Check patio pots daily throughout June, July, and August.
2. Ensure every container has drainage holes to prevent root rot during surprise British downpours.
3. Incorporate water-retaining crystals or slow-release organic mulches on container tops to cut evaporation by 40%.

---

## 3. Harvesting Rainwater with Water Butts

Mains tap water in the UK is treated with chlorine and often contains high concentrations of limescale (hard water), which can distress acid-loving plants like azaleas, blueberries, and camellias. Installing water butts beneath greenhouse and house downpipes yields pure, soft water while cutting household bills.
    `
  },
  {
    id: 'art-5',
    title: 'How to Create a Low-Maintenance UK Garden',
    slug: 'how-to-create-a-low-maintenance-uk-garden',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'Love spending time in your garden but lack the hours for constant pruning, mowing, and weeding? Discover smart architectural planting and layout shortcuts.',
    featuredImage: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80',
    altText: 'Clean modern low-maintenance garden border with hardy perennials and stone paving',
    author: defaultAuthor,
    publishDate: '2026-01-28',
    updatedDate: '2026-02-18',
    readingTime: '6 min read',
    tags: ['Low Maintenance', 'Garden Planning', 'Hardy Perennials', 'Paving'],
    isFeatured: false,
    isPopular: true,
    status: 'published',
    seoTitle: 'How to Create a Low-Maintenance UK Garden: Design & Plants',
    metaDescription: 'Practical ideas for creating a low-maintenance British garden that looks pristine year-round with minimal weeding, mowing, or pruning.',
    focusKeyword: 'low maintenance UK garden',
    canonicalUrl: '/gardening-tips/how-to-create-a-low-maintenance-uk-garden',
    faqs: [
      {
        question: 'Are gravel gardens low maintenance in the UK?',
        answer: 'Yes, when installed with a high-grade permeable weed membrane beneath, gravel gardens require virtually no mowing or watering once Mediterranean-style drought-tolerant plants are established.'
      },
      {
        question: 'What is the best alternative to a labour-intensive grass lawn?',
        answer: 'Clover lawns, creeping thyme groundcover, or self-binding gravel courtyards with wide planted borders reduce weekly maintenance significantly.'
      }
    ],
    content: `
## Spending More Time Enjoying, Less Time Labouring

A low-maintenance garden does not have to mean a sterile, depressing expanse of synthetic plastic grass or lifeless concrete slabs. With thoughtful plant selection, durable materials, and clever spatial layout, you can craft a rich, green sanctuary that demands less than an hour of work a fortnight.

---

## 1. Ditch the High-Maintenance Annuals

Bedding plants like petunias and marigolds look cheerful, but they require constant deadheading, frequent watering, and annual replacement.

Replace them with **tough herbaceous perennials and evergreens** that return year after year with greater vigour:
- **Hardy Geraniums (Cranesbills):** Varieties like *Geranium* 'Rozanne' bloom continuously from May to November, smothering weeds underneath their dense foliage.
- **Lavandula angustifolia:** Needs just a single annual trim in late August after flowering to remain compact and fragrant.
- **Euonymus & Hebe:** Reliable evergreen shrubs that maintain architectural structure in winter without trimming.

---

## 2. Rethink the High-Maintenance Lawn

A pristine striped lawn demands weekly mowing, edging, fertilising, scarifying, and weeding from April to October. Consider:

1. **Widening your borders:** Reduce lawn surface area so mowing takes just ten minutes.
2. **Installing permanent brick or stone mowing strips:** Laying a flat stone border between lawn and planting beds allows lawnmower wheels to glide right over the edge, eliminating tedious manual strimming.
3. **Clover blends:** Micro-clover stays green without chemical fertiliser and requires far less mowing.

---

## 3. Weed Suppression through High-Density Planting

Nature detests bare soil. If you leave open gaps between shrubs, weeds will promptly take up residence. Plant your borders with tight groundcovers like *Waldsteinia ternata* or *Alchemilla mollis* (Lady's Mantle) to form an impenetrable living green carpet.
    `
  },
  {
    id: 'art-6',
    title: 'Essential Gardening Jobs for Every Season in the UK',
    slug: 'essential-gardening-jobs-for-every-season-uk',
    categorySlug: 'gardening-tips',
    categoryName: 'Gardening Tips',
    excerpt: 'An indispensable year-round calendar of garden tasks broken down by UK meteorological seasons. Keep your outdoor space flourishing from January to December.',
    featuredImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    altText: 'Seasonal British garden transition with lush foliage and late summer blooms',
    author: defaultAuthor,
    publishDate: '2026-01-15',
    updatedDate: '2026-02-25',
    readingTime: '7 min read',
    tags: ['Seasonal Calendar', 'All-Year Gardening', 'Winter Care', 'Autumn Tasks'],
    isFeatured: false,
    isPopular: false,
    status: 'published',
    seoTitle: 'UK Gardening Calendar: Essential Jobs for Every Season',
    metaDescription: 'Complete seasonal checklist for British gardeners. Discover key jobs for Spring, Summer, Autumn, and Winter to maintain healthy borders and productive veg.',
    focusKeyword: 'essential gardening jobs every season UK',
    canonicalUrl: '/gardening-tips/essential-gardening-jobs-for-every-season-uk',
    faqs: [
      {
        question: 'When should I plant spring flowering bulbs like tulips and daffodils in the UK?',
        answer: 'Daffodils, crocus, and alliums are best planted in September and October. Tulips should wait until November, when colder soil temperatures prevent the fungal disease tulip fire.'
      },
      {
        question: 'What garden tasks should I focus on during cold UK winters?',
        answer: 'Winter is ideal for structural work: cleaning tools, winter-pruning apple and pear trees, planting bare-root hedging and roses, and planning your seed orders.'
      }
    ],
    content: `
## The Rhythm of the British Gardening Year

Tuning your gardening tasks to the natural rhythm of the UK seasons eliminates stress and leads to spectacular results. Here is your definitive four-season action plan.

---

## Spring (March to May): The Grand Awakening
- **March:** Prune bush roses, weed borders thoroughly, and dress with homemade compost. Sow tomatoes and chillies indoors on warm windowsills.
- **April:** Sow hardy vegetables directly outside; plant early seed potatoes. Protect delicate young growth against sudden late frosts.
- **May:** Sow tender annuals; harden off greenhouse seedlings; plant up hanging baskets and patio planters towards the end of the month.

---

## Summer (June to August): Growth and Abundance
- **June:** Stake tall perennials like delphiniums and peonies against gusty summer showers; harvest first salad crops and strawberries.
- **July:** Deadhead roses and sweet peas regularly to encourage repeat flushes of blossom; water containers during dry periods.
- **August:** Collect and store seeds from your favourite flowers; take semi-ripe cuttings of lavender and rosemary; trim established evergreen hedges.

---

## Autumn (September to November): Harvesting and Preparation
- **September:** Divide overcrowded clumps of spring and summer perennials; bring tender indoor houseplants back from summer patio holidays.
- **October:** Plant spring bulbs (daffodils, crocuses, hyacinths); collect fallen leaves to create leaf mould; clean out greenhouses.
- **November:** Plant bare-root trees, shrubs, and roses; plant tulip bulbs in cold soil to prevent disease; wrap fleece around delicate exotic shrubs.

---

## Winter (December to February): Rest, Structure, and Planning
- **December:** Check tree stakes and ties; insulate outdoor taps; provide fresh water and high-energy seed for overwintering garden birds.
- **January:** Prune dormant wisteria, apple, and pear trees; order seed catalogues; browse and plan border redesigns.
- **February:** Chit seed potatoes in egg cartons in a cool, bright spot; cut down deciduous ornamental grasses; prune autumn-fruiting raspberries.
    `
  }
];
