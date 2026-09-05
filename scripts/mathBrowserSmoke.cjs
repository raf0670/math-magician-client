// Run after `npm run build`. Uses installed Edge and the DevTools protocol, no extra dependencies.
const { spawn } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const port = 3137; const debugPort = 9237;
const origin = `http://localhost:${port}`;
const artifacts = path.resolve('.math-browser');
mkdirSync(artifacts, { recursive: true });
const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { windowsHide: true, stdio: 'ignore' });
let browser; let socket; let sequence = 0;
const pending = new Map(); const errors = []; const apiRequests = [];
let signup = false; let authenticated = true; let existingHouse = false; let recordedCheckout;
const rank = { rankName: 'Silver III', tier: 'Silver', level: 'III', rankPoints: 10, countedExamCount: 1, pointsIntoLevel: 10, pointsToNextLevel: 10, nextRankName: 'Silver II' };
let user = { id: '507f1f77bcf86cd799439011', name: 'Math Test Student', email: 'math@example.com', role: 'student', hasMathAccess: true, hasClassAccess: false, mathRankInfo: rank, rankInfo: rank };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(action, label) {
    for (let attempt = 0; attempt < 100; attempt++) { try { if (await action()) return; } catch {} await pause(100); }
    throw new Error(`Timed out: ${label}`);
}
function send(method, params = {}) {
    const id = ++sequence;
    return new Promise((resolve, reject) => { const timer = setTimeout(() => { pending.delete(id); reject(new Error('DevTools timeout: ' + method)); }, 10000); pending.set(id, { resolve: value => { clearTimeout(timer); resolve(value); }, reject: error => { clearTimeout(timer); reject(error); } }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description);
    return result.result.value;
}
async function mockRequest(event) {
    const url = new URL(event.request.url);
    if (!url.pathname.startsWith('/api/')) {
        if (url.origin === origin) return send('Fetch.continueRequest', { requestId: event.requestId });
        return send('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: 204 });
    }
    apiRequests.push(url.pathname + url.search);
    const body = event.request.postData ? JSON.parse(event.request.postData) : {};
    let payload = { success: true, data: [] };
    if (url.pathname === '/api/auth/me') payload.data = user;
    if (url.pathname === '/api/auth/register' || url.pathname === '/api/auth/login') { signup = true; payload = { success: true, token: 'smoke-token', user }; }
    if (url.pathname === '/api/payments/my-access') payload.data = user;
    if (url.pathname === '/api/payments/math-context') payload.data = { ...user, existingHouseEligible: existingHouse };
    if (url.pathname === '/api/payments/quote') {
        const originalAmount = body.planId === 'mathSlytherin' ? 11998 : 5999;
        const discountAmount = Math.max(existingHouse ? originalAmount * 0.25 : 0, body.couponCode === 'MAGNUS500' ? 500 : 0);
        payload.data = { planId: body.planId, originalAmount, discountAmount, amount: originalAmount - discountAmount, discountType: existingHouse ? 'existingHouse' : 'coupon' };
    }
    if (url.pathname === '/api/payments/manual-enrollment') { recordedCheckout = body; payload.data = { paymentUrl: `${origin}/payment/success?status=paid&plan=${body.planId}` }; }
    if (url.pathname === '/api/analytics/my-stats') payload = { success: true, stats: { totalExams: 0, rankInfo: rank }, rankInfo: rank, history: [] };
    if (url.pathname === '/api/analytics/competition') payload.data = { leaderboard: [], houses: [], badges: [], champions: {}, currentUserEntry: null };
    if (url.pathname === '/api/classes/current') payload.data = null;
    if (url.pathname === '/api/classes/catalog') payload.data = ['Basic', 'Archive'].map(label => ({ label: `${label} Classes`, topics: Array.from({ length: 12 }, (_, i) => ({ label: `${label} Class ${i + 1}`, href: '' })) }));
    const responseBody = Buffer.from(JSON.stringify(payload)).toString('base64');
    return send('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }, { name: 'Access-Control-Allow-Headers', value: 'authorization, content-type' }, { name: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' }], body: responseBody });
}
let bootScript;
async function navigate(route) {
    if (bootScript) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: bootScript });
    const source = `localStorage.clear(); ${authenticated ? `localStorage.setItem('exam_archive_token','smoke-token');localStorage.setItem('exam_archive_user',${JSON.stringify(JSON.stringify(user))});` : ''}`;
    bootScript = (await send('Page.addScriptToEvaluateOnNewDocument', { source })).identifier;
    await send('Page.navigate', { url: origin + route });
    await until(() => evaluate('document.readyState === "complete"'), route);
}
async function textContains(text) { await until(() => evaluate(`document.body.innerText.includes(${JSON.stringify(text)})`), text); }
async function screenshot(name) { const result = await send('Page.captureScreenshot', { format: 'png' }); writeFileSync(path.join(artifacts, name + '.png'), Buffer.from(result.data, 'base64')); }
async function field(label, value) {
    await evaluate(`(() => {const label=Array.from(document.querySelectorAll('label')).find(x=>x.textContent.trim().startsWith(${JSON.stringify(label)}));const input=label?.querySelector('input:not([type=checkbox]),textarea,select') || label?.control || label?.parentElement.querySelector('input,textarea,select') || label?.parentElement.parentElement.querySelector('input,textarea,select');if(!input)throw Error('Field not found: '+ label?.textContent);const proto=input.tagName==='SELECT'?HTMLSelectElement.prototype:input.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));})()`);
}
async function checkbox(label) { await evaluate(`Array.from(document.querySelectorAll('label')).find(x=>x.textContent.trim().startsWith(${JSON.stringify(label)})).querySelector('input[type=checkbox]').click()`); }
async function main() {
    await until(async () => (await fetch(origin, { signal: AbortSignal.timeout(1500) })).ok, 'Next server');
    console.log('Next server ready');
    browser = spawn(process.env.MATH_TEST_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${path.join(artifacts, 'edge-profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
    let target;
    await until(async () => { target = (await (await fetch(`http://127.0.0.1:${debugPort}/json`, { signal: AbortSignal.timeout(1500) })).json()).find(item => item.type === 'page'); return target; }, 'Edge DevTools');
    console.log('Edge DevTools ready');
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
    socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.id) { const promise = pending.get(message.id); pending.delete(message.id); if (message.error) promise?.reject(new Error(message.error.message)); else promise?.resolve(message.result); }
        if (message.method === 'Fetch.requestPaused') mockRequest(message.params).catch(error => errors.push(error.message));
        if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    });
    await send('Page.enable'); await send('Runtime.enable'); await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
    await send('Emulation.setDeviceMetricsOverride', { width: 1365, height: 1000, deviceScaleFactor: 1, mobile: false });
    await navigate('/math-course'); await textContains('Basic Recorded Classes');
    assert.equal(await evaluate(`document.querySelector('a[href="/payment/details?plan=math"]').textContent.includes('Enroll in Math')`), true);
    await evaluate(`document.querySelector('a[href="#slytherin"]').click()`);
    await until(() => evaluate('location.hash === "#slytherin"'), 'Slytherin scroll');
    await screenshot('landing-desktop');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await navigate('/math-course'); await textContains('Basic Recorded Classes');
    assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'Mobile landing overflows');
    await screenshot('landing-mobile');
    console.log('PASS landing CTAs, Slytherin scroll, desktop/mobile layout');

    authenticated = false; user = { ...user, hasMathAccess: false };
    await navigate('/payment/details?plan=mathSlytherin'); await textContains('Create your account');
    // Signup is a client transition, preserving the saved plan in local storage.
    await field('Name', 'Math Test Student'); await field('Email', 'math@example.com'); await field('Password', 'password123');
    await evaluate('document.querySelector("form").requestSubmit()');
    await textContains('Your math journey starts here'); await textContains('BDT 11,998');
    assert.ok(signup); authenticated = true;
    await checkbox('Add Slytherin'); await textContains('BDT 5,999');
    await field('Discount code', 'MAGNUS500');
    await evaluate(`Array.from(document.querySelectorAll('button')).find(x=>x.textContent==='Apply').click()`);
    await textContains('BDT 5,499');
    for (const [label, value] of [['Your name','Math Test Student'],['Email address','math@example.com'],['Phone number','01700000000'],['Address','Dhaka'],['Facebook profile link','https://facebook.com/test'],['College','Test College'],['Group','Science'],['HSC batch','2026 or equivalent'],['Do you have a clear idea','Yes'],['2. What is your biggest fear','Time pressure']]) await field(label, value);
    await checkbox('IBA JU'); await checkbox('By myself'); await checkbox('Personal batch'); await checkbox('Wrong approach'); await checkbox('Others');
    await field('Tell us more','Geometry'); await checkbox('I have read and agree');
    await screenshot('enrollment-mobile');
    await evaluate('document.querySelector("form").requestSubmit()'); await textContains('Access is unlocked');
    assert.equal(recordedCheckout.planId, 'math'); assert.equal(recordedCheckout.expectedAmount, 5499);
    assert.deepEqual(recordedCheckout.formData.preparationMethods, ['By myself','Personal batch']);
    assert.deepEqual(recordedCheckout.formData.mathWeaknesses, ['Wrong approach','Others']);
    console.log('PASS signup continuation, bundle switch, discount, multi-select survey, checkout payload');

    user = { ...user, hasMathAccess: true };
    await navigate('/dashboard'); await textContains('Your Math Course');
    assert.ok(await evaluate(`location.pathname === '/dashboard/math'`));
    assert.equal(await evaluate(`Boolean(document.querySelector('nav a[href="/dashboard/live-exams"]'))`), false);
    await screenshot('dashboard-mobile');
    await navigate('/dashboard/math/archived-classes'); await textContains('Archive Class 12');
    assert.equal(await evaluate(`Array.from(document.querySelectorAll('p')).filter(x=>x.textContent==='Coming soon').length`), 24);
    await navigate('/dashboard/math/live-exams'); await textContains('No live exams posted yet');
    assert.ok(apiRequests.includes('/api/exams/live?program=math'));
    await navigate('/dashboard/math/leaderboard'); await textContains('Math Leaderboard');
    assert.ok(apiRequests.includes('/api/analytics/competition?program=math'));
    assert.ok(await evaluate('document.documentElement.scrollWidth <= window.innerWidth + 1'), 'Mobile leaderboard overflows');
    console.log('PASS math-only navigation, redirect, recordings, exams and leaderboard');

    await navigate('/payment/details?plan=slytherinUpgrade'); await textContains('We will use the details from your math enrollment.'); await textContains('BDT 5,999');
    assert.equal(await evaluate("Boolean(document.querySelector('#math-coupon'))"), false);
    await checkbox('I have read and agree');
    await evaluate('document.querySelector("form").requestSubmit()'); await textContains('Access is unlocked');
    assert.equal(recordedCheckout.planId, 'slytherinUpgrade'); assert.equal(recordedCheckout.expectedAmount, 5999);
    authenticated = false; user = { ...user, hasMathAccess: false };
    await navigate('/payment/details?plan=math'); await textContains('Create your account');
    await evaluate(`document.querySelector('a[href="/login"]').click()`); await textContains('Welcome back');
    await field('Email','math@example.com'); await field('Password','password123');
    await evaluate('document.querySelector("form").requestSubmit()'); await textContains('Your math journey starts here'); await textContains('BDT 5,999');
    authenticated = true;
    console.log('PASS later upgrade and login continuation');

    existingHouse = true; user = { ...user, hasMathAccess: false, hasClassAccess: true, house: 'Gryffindor' };
    await navigate('/payment/details?plan=mathSlytherin'); await textContains('BDT 4,499.25');
    assert.equal(await evaluate(`Boolean(Array.from(document.querySelectorAll('label')).find(x=>x.textContent.includes('Add Slytherin'))) `), false);
    user = { ...user, role: 'admin', hasMathAccess: true };
    await navigate('/dashboard/admin/math/live-exams'); await textContains('Math Exam Admin');
    assert.ok(apiRequests.includes('/api/exams/live/admin?program=math'));
    assert.ok(await evaluate(`Array.from(document.querySelectorAll('option')).some(x=>x.textContent==='Full-Length Math')`));
    await send('Emulation.setDeviceMetricsOverride', { width: 1365, height: 1000, deviceScaleFactor: 1, mobile: false });
    await screenshot('math-admin-desktop');
    console.log('PASS existing-house price and separate math exam admin');
    assert.deepEqual(errors, [], 'Browser runtime errors');
    console.log('All math browser smoke checks passed. Screenshots: .math-browser/');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
    try { if (socket?.readyState === WebSocket.OPEN) await send('Browser.close'); } catch {}
    socket?.close(); browser?.kill(); next.kill();
});
