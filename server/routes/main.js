const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const Club = require('../models/Club');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'avatar') {
      cb(null, path.join(__dirname, '../../public/img'));
    } else {
      cb(null, path.join(__dirname, '../../public/img/uploads'));
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === 'avatar') {
      const ext = path.extname(file.originalname);
      cb(null, req.session.user.id + '_avatar' + ext);
    } else {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + '_' + Math.round(Math.random() * 1E9) + ext);
    }
  }
});
const upload = multer({ storage });

// Home page
router.get('/', async (req, res) => {
    try {
        const clubs = [
            {
                name: 'ACPC',
                img: '/img/download.png',
                url: '/clubs/acpc',
                alt: 'ACPC Photo'
            },
            {
                name: 'Enactus',
                img: '/img/Enactus-01.jpg',
                url: '/clubs/enactus',
                alt: 'Enactus Photo'
            },
            {
                name: 'TEDx',
                img: '/img/TEDxCairoUni.jpg',
                url: '/clubs/tedx',
                alt: 'TEDx Photo'
            },
            {
                name: 'MUN',
                img: '/img/MUN-01.jpg',
                url: '/clubs/mun',
                alt: 'MUN Photo'
            },
            {
                name: 'Gamers Legacy',
                img: '/img/Gamers-01.jpg',
                url: '/clubs/gamers-legacy',
                alt: 'Gamers Legacy Photo'
            },
            {
                name: 'Tunners',
                img: '/img/Tuners-03.jpg',
                url: '/clubs/tunners',
                alt: 'Tunners Photo'
            },
            {
                name: 'El Warsha',
                img: '/img/warsha-03.jpg',
                url: '/clubs/el-warsha',
                alt: 'El Warsha Photo'
            },
            {
                name: 'MOVE',
                img: '/img/Move-03.jpg',
                url: '/clubs/move',
                alt: 'MOVE Photo'
            },
            {
                name: 'IHEPC',
                img: '/img/IHEPC-03.jpg',
                url: '/clubs/ihepc',
                alt: 'IHEPC Photo'
            }
        ];
        res.render('pages/index', { 
            title: 'MIU Clubs & Organizations',
            path: '/',
            clubs
        });
    } catch (error) {
        console.error('Error in home route:', error);
        res.status(500).render('pages/error', {
            title: 'Error',
            message: 'An error occurred while loading the page',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

// Communities page
router.get('/communities', (req, res) => {
    // For a shared community, use a single slug like 'community'
    const membershipStatus = getMembershipStatus(req.session.user, 'community');
    res.render('pages/communities', {
        title: 'Communities',
        path: '/communities',
        user: req.session.user,
        membershipStatus,
        error: req.query.error || undefined,
        success: req.query.success || undefined
    });
});

// Join Us page
router.get('/join-us', (req, res) => {
    const clubs = [
        { name: 'ACPC', url: '/clubs/acpc' },
        { name: 'Enactus', url: '/clubs/enactus' },
        { name: 'TEDx', url: '/clubs/tedx' },
        { name: 'MUN', url: '/clubs/mun' },
        { name: 'Gamers Legacy', url: '/clubs/gamers-legacy' },
        { name: 'Tunners', url: '/clubs/tunners' },
        { name: 'El Warsha', url: '/clubs/el-warsha' },
        { name: 'MOVE', url: '/clubs/move' },
        { name: 'IHEPC', url: '/clubs/ihepc' }
    ];
    res.render('pages/contact', {
        title: 'Join Us',
        path: '/join-us',
        clubs,
        user: req.session.user,
        error: req.query.error || undefined,
        success: req.query.success || undefined
    });
});

// Our Clubs main page
router.get('/our-clubs', (req, res) => {
    const clubs = [
        {
            name: 'ACPC',
            img: '/img/download.png',
            url: '/clubs/acpc',
            alt: 'ACPC Photo'
        },
        {
            name: 'Enactus',
            img: '/img/Enactus-01.jpg',
            url: '/clubs/enactus',
            alt: 'Enactus Photo'
        },
        {
            name: 'TEDx',
            img: '/img/TEDxCairoUni.jpg',
            url: '/clubs/tedx',
            alt: 'TEDx Photo'
        },
        {
            name: 'MUN',
            img: '/img/MUN-01.jpg',
            url: '/clubs/mun',
            alt: 'MUN Photo'
        },
        {
            name: 'Gamers Legacy',
            img: '/img/Gamers-01.jpg',
            url: '/clubs/gamers-legacy',
            alt: 'Gamers Legacy Photo'
        },
        {
            name: 'Tunners',
            img: '/img/Tuners-03.jpg',
            url: '/clubs/tunners',
            alt: 'Tunners Photo'
        },
        {
            name: 'El Warsha',
            img: '/img/warsha-03.jpg',
            url: '/clubs/el-warsha',
            alt: 'El Warsha Photo'
        },
        {
            name: 'MOVE',
            img: '/img/Move-03.jpg',
            url: '/clubs/move',
            alt: 'MOVE Photo'
        },
        {
            name: 'IHEPC',
            img: '/img/IHEPC-03.jpg',
            url: '/clubs/ihepc',
            alt: 'IHEPC Photo'
        }
    ];
    res.render('pages/our-clubs', { 
        title: 'Our Clubs',
        path: '/our-clubs',
        clubs
    });
});

// Club data object for dynamic detail pages
const clubsData = {
    acpc: {
        name: 'ACPC',
        img: '/img/download.png',
        alt: 'ACPC Photo',
        description: 'The ACPC Club focuses on competitive programming and algorithmic problem-solving. The club prepares students for top-tier contests like the ICPC (International Collegiate Programming Contest). It promotes excellence in coding among its members. Members participate in regular training sessions. The club organizes coding challenges to sharpen skills. The club supports members success in the tech industry.',
        video: 'https://www.youtube.com/embed/y2_p0qwdDc4',
        bullets: [
            'The ACPC Club focuses on competitive programming and algorithmic problem-solving.',
            'The club prepares students for top-tier contests like the ICPC (International Collegiate Programming Contest).',
            'It promotes excellence in coding among its members.',
            'Members participate in regular training sessions.',
            'The club organizes coding challenges to sharpen skills.',
            'The club supports members success in the tech industry.'
        ],
        features: [
            { icon: 'fa-chalkboard-teacher', text: 'Expert mentorship and support' },
            { icon: 'fa-sync-alt', text: 'Continuous learning and feedback' },
            { icon: 'fa-coins', text: 'High-impact, no-cost membership' }
        ]
    },
    enactus: {
        name: 'Enactus',
        img: '/img/Enactus-01.jpg',
        alt: 'Enactus Photo',
        description: 'A global organization that inspires students to improve the world through entrepreneurial action.',
        video: 'https://www.youtube.com/embed/AalzmGiMG8o',
        bullets: [
            'Enactus is a global organization focused on empowering students through social entrepreneurship.',
            'MIU Enactus participates in national competitions among 56 Egyptian universities.',
            'The team aspires to represent Egypt in the Enactus World Cup.',
            'The World Cup features competition among 37 countries worldwide.'
        ],
        features: [
            { icon: 'fa-users', text: 'Strong team support' },
            { icon: 'fa-check', text: 'Project success guaranteed' },
            { icon: 'fa-hand-holding-usd', text: 'Cost-effective solutions' }
        ]
    },
    tedx: {
        name: 'TEDx',
        img: '/img/TEDxCairoUni.jpg',
        alt: 'TEDx Photo',
        description: 'A community dedicated to spreading powerful ideas through local TED-like experiences.',
        video: 'https://www.youtube.com/embed/j4QlG5jKpio?si=auiqy2tQTxDqnrKx',
        bullets: [
            'TEDx is a program of local, self-organized events that bring people together to share a TED-like experience.',
            'At a TEDx event, TED Talks video and live speakers combine to spark deep discussion and connection.',
            'TEDx events are fully planned and coordinated independently, on a community-by-community basis.'
        ],
        features: [
            { icon: 'fa-microphone', text: 'Event organization' },
            { icon: 'fa-comments', text: 'Public speaking' },
            { icon: 'fa-lightbulb', text: 'Idea sharing' }
        ]
    },
    mun: {
        name: 'MUN',
        img: '/img/MUN-01.jpg',
        alt: 'MUN Photo',
        description: 'Model United Nations club where students simulate UN conferences and improve diplomacy and public speaking skills.',
        video: 'https://www.youtube.com/embed/gt1LT4XKP5Q?si=bx-VhRIkPTi3fA4B',
        bullets: [
            'Model United Nations (MUN) is an academic simulation of the United Nations.',
            'Students play the role of delegates from different countries and attempt to solve real world issues.',
            'MUN helps students develop public speaking, writing, and diplomatic skills.'
        ],
        features: [
            { icon: 'fa-globe', text: 'Debate and diplomacy' },
            { icon: 'fa-flag', text: 'International relations' },
            { icon: 'fa-users-cog', text: 'Conference participation' }
        ]
    },
    'gamers-legacy': {
        name: 'Gamers Legacy',
        img: '/img/Gamers-01.jpg',
        alt: 'Gamers Legacy Photo',
        description: 'A hub for video game enthusiasts to connect, play, and organize gaming events and tournaments.',
        video: 'https://www.youtube.com/embed/RJfs4R63aqU?si=SeLaN89kYiBOx_cD',
        bullets: [
            'Gamers Legacy is a club for video game enthusiasts.',
            'The club organizes gaming tournaments and community events.',
            'Members can participate in team play and competitions.'
        ],
        features: [
            { icon: 'fa-chart-line', text: 'Legacy Ranking System' },
            { icon: 'fa-gamepad', text: 'Game Vault Access' },
            { icon: 'fa-graduation-cap', text: 'Legacy Mentor Network' }
        ]
    },
    tunners: {
        name: 'Tunners',
        img: '/img/Tuners-03.jpg',
        alt: 'Tunners Photo',
        description: 'A music club for students passionate about playing instruments, jamming, and performing live.',
        bullets: [
            'Tunners is a music club for students who love playing instruments.',
            'The club hosts live performances and music workshops.',
            'Members can form bands and jam together.'
        ],
        features: [
            { icon: 'fa-music', text: 'Live performances' },
            { icon: 'fa-guitar', text: 'Music workshops' },
            { icon: 'fa-users', text: 'Band formation' }
        ]
    },
    'el-warsha': {
        name: 'El Warsha',
        img: '/img/warsha-03.jpg',
        alt: 'El Warsha Photo',
        description: 'An artistic space for students interested in painting, sculpture, and creative expression.',
        bullets: [
            'El Warsha is an artistic club for creative students.',
            'The club organizes art exhibitions and workshops.',
            'Members can work on creative projects and showcase their art.'
        ],
        features: [
            { icon: 'fa-paint-brush', text: 'Art exhibitions' },
            { icon: 'fa-palette', text: 'Workshops' },
            { icon: 'fa-lightbulb', text: 'Creative projects' }
        ]
    },
    move: {
        name: 'MOVE',
        img: '/img/Move-03.jpg',
        alt: 'MOVE Photo',
        description: 'A club for organizing social activities and awareness campaigns to engage and empower students.',
        bullets: [
            'MOVE organizes social activities and awareness campaigns.',
            'The club empowers students to engage in community service.',
            'Members participate in various events and campaigns.'
        ],
        features: [
            { icon: 'fa-bullhorn', text: 'Social campaigns' },
            { icon: 'fa-users', text: 'Student engagement' },
            { icon: 'fa-lightbulb', text: 'Awareness events' }
        ]
    },
    ihepc: {
        name: 'IHEPC',
        img: '/img/IHEPC-03.jpg',
        alt: 'IHEPC Photo',
        description: 'The IEEE Humanitarian Engineering Project Community focused on projects that serve society through technology.',
        video: 'https://www.youtube.com/embed/gDJmlO_W8EM?si=mrblECpqaM6Vgg6N',
        bullets: [
            'IHEPC focuses on humanitarian engineering projects.',
            'The club uses technology to serve society.',
            'Members work on projects that have a positive impact.'
        ],
        features: [
            { icon: 'fa-hands-helping', text: 'Humanitarian projects' },
            { icon: 'fa-cogs', text: 'Engineering for good' },
            { icon: 'fa-microchip', text: 'Technology and society' }
        ]
    }
};

// Dynamic club detail route
router.get('/clubs/:club', (req, res) => {
    const club = clubsData[req.params.club];
    if (!club) return res.status(404).render('pages/404', { title: 'Not Found', path: '' });
    res.render('pages/club-detail', {
        title: club.name,
        path: `/clubs/${req.params.club}`,
        club
    });
});

// Dummy data for demonstration
const communityPosts = {
    acpc: [],
    enactus: [],
    tedx: [],
    mun: [],
    'gamers-legacy': [],
    tunners: [],
    'el-warsha': [],
    move: [],
    ihepc: []
};

// Middleware to mock user and membership status (replace with real logic)
function mockAuth(req, res, next) {
    // Example: req.user = { name: 'John Doe', username: 'johndoe', avatar: '/img/default-avatar.png', verified: true };
    req.user = req.session && req.session.user ? req.session.user : null;
    next();
}

function getMembershipStatus(user, clubSlug) {
    // Replace with real DB logic
    if (!user) return 'not_member';
    if (user.pendingCommunities && user.pendingCommunities.includes(clubSlug)) return 'pending';
    if (user.communities && user.communities.includes(clubSlug)) return 'member';
    return 'not_member';
}

// Protect the community page
router.get('/communities/community', async (req, res) => {
    // Only allow community members to view (adjust as needed)
    if (!req.session.user || !req.session.user.communityMember) {
        return res.redirect('/communities?error=You must be an approved community member to access this page.');
    }
    const posts = await Post.find({ community: true })
        .populate({ path: 'author', select: 'username avatar' })
        .populate({ path: 'comments.author', select: 'username avatar' })
        .sort({ createdAt: -1 })
        .lean();
    const userId = req.session.user ? String(req.session.user.id) : null;
    posts.forEach(post => {
        post.likeCount = post.likes ? post.likes.length : 0;
        post.likedByCurrentUser = userId ? post.likes && post.likes.some(id => String(id) === userId) : false;
    });
    // Fetch all community members
    const communityMembers = await User.find({ communityMember: true }, 'username avatar').lean();
    res.render('pages/club-community', {
        title: 'Clubs Community',
        path: '/communities/community',
        club: { name: 'Clubs Community', slug: 'community' },
        user: req.session.user,
        membershipStatus: 'member',
        posts,
        communityMembers,
        layout: false
    });
});

router.post('/communities/community/posts', upload.single('media'), async (req, res) => {
    try {
        console.log('POST /communities/community/posts');
        console.log('Session user:', req.session.user);
        console.log('Body:', req.body);
        console.log('File:', req.file);
        
        if (!req.session.user) {
            console.log('No user in session');
            return res.redirect('/auth/login');
        }
        
        if (!req.session.user.communityMember) {
            console.log('User is not a community member');
            return res.redirect('/communities?error=You must be an approved community member to post.');
        }
        
        const { content } = req.body;
        if (!content && !req.file) {
            console.log('Empty post');
            return res.redirect('/communities/community?error=Post cannot be empty');
        }
        
        console.log('Creating new post...');
        const post = new Post({
            author: req.session.user.id,
            community: true,
            content,
            media: req.file ? '/img/uploads/' + req.file.filename : undefined
        });
        
        await post.save();
        console.log('Post saved successfully');
        res.redirect('/communities/community');
    } catch (err) {
        console.error('Error posting to community feed:', err);
        res.redirect('/communities/community?error=Server error');
    }
});

// Dynamic club community page
router.get('/communities/:club', async (req, res) => {
    if (req.params.club === 'community') {
        return res.redirect('/communities/community');
    }
    const club = await Club.findOne({ name: new RegExp('^' + req.params.club + '$', 'i') });
    if (!club) return res.status(404).render('pages/404', { title: 'Not Found', path: '' });
    const posts = await Post.find({ club: club._id })
        .populate({
            path: 'author',
            select: 'username avatar',
        })
        .populate({
            path: 'comments.author',
            select: 'username avatar',
        })
        .sort({ createdAt: -1 })
        .lean();
    // Add likedByCurrentUser and likeCount for each post
    const userId = req.session.user ? String(req.session.user.id) : null;
    posts.forEach(post => {
        post.likeCount = post.likes ? post.likes.length : 0;
        post.likedByCurrentUser = userId ? post.likes && post.likes.some(id => String(id) === userId) : false;
    });
    res.render('pages/club-community', {
        title: `${club.name} Community`,
        path: `/communities/${req.params.club}`,
        club: { ...club.toObject(), slug: req.params.club },
        user: req.session.user,
        membershipStatus: req.session.user ? 'member' : 'not_member', // Adjust as needed
        posts,
        layout: false
    });
});

// Handle join request
router.post('/communities/:club/join', async (req, res) => {
    if (!req.session.user) return res.redirect(`/auth/login?redirect=/communities/${req.params.club}`);
    
    try {
        const user = await User.findById(req.session.user.id);
        if (!user) return res.redirect('/auth/login');
        
        // If joining the main community, set communityMember to true
        if (req.params.club === 'community') {
            user.communityMember = true;
            await user.save();
            req.session.user.communityMember = true;
        }
        
        // Add to pendingCommunities if not already a member
        if (!user.communities || !user.communities.includes(req.params.club)) {
            user.pendingCommunities = user.pendingCommunities || [];
            if (!user.pendingCommunities.includes(req.params.club)) {
                user.pendingCommunities.push(req.params.club);
                await user.save();
            }
        }
        
        res.redirect(`/communities/${req.params.club}`);
    } catch (err) {
        console.error('Error joining community:', err);
        res.redirect(`/communities/${req.params.club}?error=Error joining community`);
    }
});

// Mark all notifications as read
router.post('/notifications/mark-read', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Not logged in');
    await Notification.updateMany({ user: req.session.user.id, read: false }, { $set: { read: true } });
    res.sendStatus(200);
});

// Profile page for logged-in user
router.get('/profile', async (req, res) => {
    if (!req.session.user) return res.redirect('/auth/login');
    const user = await User.findById(req.session.user.id).populate('clubs.club').lean();
    const posts = await Post.find({ author: user._id })
        .populate('club')
        .sort({ createdAt: -1 })
        .lean();
    res.render('pages/profile', {
        title: `${user.username}'s Profile`,
        path: '/profile',
        profileUser: user,
        posts,
        user: req.session.user,
        success: req.query.success,
        error: req.query.error
    });
});

// Public profile page by username
router.get('/users/:username', async (req, res) => {
    const user = await User.findOne({ username: req.params.username }).populate('clubs.club').lean();
    if (!user) return res.status(404).render('pages/404', { title: 'Not Found', path: '' });
    const posts = await Post.find({ author: user._id })
        .populate('club')
        .sort({ createdAt: -1 })
        .lean();
    res.render('pages/profile', {
        title: `${user.username}'s Profile`,
        path: `/users/${user.username}`,
        profileUser: user,
        posts,
        user: req.session.user,
        success: req.query.success,
        error: req.query.error
    });
});

// Edit avatar only
router.post('/profile/edit', upload.single('avatar'), async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const user = await User.findById(req.session.user.id);
  if (!user) return res.status(404).send('User not found');

  if (req.file) {
    user.avatar = '/img/' + req.file.filename;
    await user.save();
    req.session.user.avatar = user.avatar;
    return res.redirect('/profile?success=Avatar updated successfully!');
  }
  res.redirect('/profile');
});

// Edit bio and password only
router.post('/profile/edit-bio', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const user = await User.findById(req.session.user.id);
  if (!user) return res.status(404).send('User not found');

  let error = null;
  if (req.body.password) {
    if (req.body.password.length < 6) {
      error = 'Password must be at least 6 characters.';
    } else if (req.body.password !== req.body.confirmPassword) {
      error = 'Passwords do not match.';
    }
  }
  if (error) {
    return res.redirect('/profile?error=' + encodeURIComponent(error));
  }

  if (req.body.bio !== undefined) user.bio = req.body.bio;
  if (req.body.password && req.body.password.length >= 6) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }
  await user.save();
  req.session.user.bio = user.bio;
  res.redirect('/profile?success=Profile updated successfully!');
});

// Post a new message in the community feed
router.post('/communities/:club/posts', upload.single('media'), async (req, res) => {
  try {
    console.log('POST /communities/:club/posts');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    if (!req.session.user) {
      console.log('Not logged in');
      return res.redirect('/auth/login');
    }
    const { content } = req.body;
    if (!content && !req.file) {
      console.log('Empty post');
      return res.redirect(`/communities/${req.params.club}?error=Post cannot be empty`);
    }
    const club = await Club.findOne({ name: new RegExp('^' + req.params.club + '$', 'i') });
    if (!club) {
      console.log('Club not found:', req.params.club);
      return res.redirect(`/communities/${req.params.club}?error=Club not found`);
    }
    const post = new Post({
      author: req.session.user.id,
      club: club._id,
      content,
      media: req.file ? '/img/uploads/' + req.file.filename : undefined
    });
    await post.save();
    console.log('Post saved:', post._id);
    res.redirect(`/communities/${req.params.club}`);
  } catch (err) {
    console.error('Error posting:', err);
    res.redirect(`/communities/${req.params.club}?error=Server error`);
  }
});

// Like/unlike a post
router.post('/communities/:club/posts/:postId/like', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const userId = req.session.user.id;
  const userIdStr = userId.toString();
  const alreadyLiked = post.likes.some(id => id.toString() === userIdStr);
  let liked;
  console.log('LIKE ROUTE: typeof userId:', typeof userId, 'userId:', userId);
  console.log('LIKE ROUTE: isValidObjectId:', mongoose.Types.ObjectId.isValid(userId));
  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id.toString() !== userIdStr);
    liked = false;
  } else {
    // Only wrap as ObjectId if userId is a string
    if (typeof userId === 'string') {
      post.likes.push(mongoose.Types.ObjectId(userId));
    } else {
      post.likes.push(userId);
    }
    liked = true;
  }
  await post.save();
  res.json({ likes: post.likes.length, liked });
});

// Add a comment to a post
router.post('/communities/:club/posts/:postId/comment', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ error: 'Comment cannot be empty' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.comments.push({ author: req.session.user.id, content: comment });
  await post.save();
  res.json({ comments: post.comments.length });
});

// Delete a post (only by author)
router.post('/communities/:club/posts/:postId/delete', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send('Post not found');
  if (String(post.author) !== String(req.session.user.id)) return res.status(403).send('Forbidden');
  await post.deleteOne();
  res.redirect(`/communities/${req.params.club}`);
});

// Edit a post's text (only by author)
router.post('/communities/:club/posts/:postId/edit', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send('Post not found');
  if (String(post.author) !== String(req.session.user.id)) return res.status(403).send('Forbidden');
  if (req.body.content && req.body.content.trim().length > 0) {
    post.content = req.body.content.trim();
    await post.save();
  }
  res.redirect(`/communities/${req.params.club}`);
});

// RESTful DELETE post (AJAX)
router.delete('/communities/:club/posts/:postId', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  if (String(post.author) !== String(req.session.user.id)) return res.status(403).json({ success: false, error: 'Forbidden' });
  await post.deleteOne();
  res.json({ success: true });
});

// RESTful PUT edit post (AJAX)
router.put('/communities/:club/posts/:postId', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  if (String(post.author) !== String(req.session.user.id)) return res.status(403).json({ success: false, error: 'Forbidden' });
  if (req.body.content && req.body.content.trim().length > 0) {
    post.content = req.body.content.trim();
    await post.save();
    return res.json({ success: true });
  }
  res.json({ success: false, error: 'Content required' });
});

// Add more routes for other pages as you convert them

module.exports = router;