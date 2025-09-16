'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();
// Fallback: load yep.env if .env not present
if (!process.env.FIREBASE_API_KEY) {
	const altEnvPath = path.join(__dirname, 'yep.env');
	if (fs.existsSync(altEnvPath)) {
		require('dotenv').config({ path: altEnvPath });
	}
}

const app = express();

// Security middlewares
app.use(helmet({
	contentSecurityPolicy: false
}));
app.use(compression());

// Serve static assets
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { maxAge: '1d', index: false }));

// Firebase config injection
function getFirebaseConfigString() {
	const cfg = {
		apiKey: process.env.FIREBASE_API_KEY || '',
		authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
		projectId: process.env.FIREBASE_PROJECT_ID || '',
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
		messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
		appId: process.env.FIREBASE_APP_ID || ''
	};
	return JSON.stringify(cfg);
}

// Serve index with runtime Firebase config injection
app.get(['/', '/index.html'], (req, res, next) => {
	res.setHeader('Cache-Control', 'no-store');
	const filePath = path.join(publicDir, 'index.html');
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) return next(err);
		const injected = data.replace('__FIREBASE_CONFIG__', getFirebaseConfigString());
		res.type('html').send(injected);
	});
});

// Fallback to index for other routes (SPA style)
app.get('*', (req, res, next) => {
	if (req.path.endsWith('.html')) return next();
	res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Monastery360 running on http://localhost:${port}`);
});


