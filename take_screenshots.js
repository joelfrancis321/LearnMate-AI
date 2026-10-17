import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const SCREENSHOT_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Also save directly to artifact directory for embedding
const ARTIFACT_DIR = path.resolve('C:/Users/joelf/.gemini/antigravity/brain/bf86566e-cb15-4e83-aff3-9568d7600987');

async function run() {
  console.log('Launching browser via Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

  const BASE_URL = 'http://127.0.0.1:8000';

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000)); // wait for charts to animate

  // 1. Dashboard Screenshot
  console.log('Capturing 01_dashboard.png...');
  const dashPath = path.join(SCREENSHOT_DIR, '01_dashboard.png');
  await page.screenshot({ path: dashPath, fullPage: true });
  fs.copyFileSync(dashPath, path.join(ARTIFACT_DIR, '01_dashboard.png'));

  // Helper to click nav items by text
  const clickNav = async (text) => {
    const buttons = await page.$$('header nav button');
    for (const btn of buttons) {
      const btnText = await page.evaluate(el => el.innerText, btn);
      if (btnText.includes(text)) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        return true;
      }
    }
    return false;
  };

  // 2. Learn & Practice
  console.log('Capturing 02_learn_practice.png...');
  await clickNav('Learn & Practice');
  const learnPath = path.join(SCREENSHOT_DIR, '02_learn_practice.png');
  await page.screenshot({ path: learnPath, fullPage: true });
  fs.copyFileSync(learnPath, path.join(ARTIFACT_DIR, '02_learn_practice.png'));

  // 3. AI Tutor
  console.log('Capturing 03_ai_tutor.png...');
  await clickNav('AI Tutor');
  // Click first suggested prompt to generate real response
  const promptButtons = await page.$$('button');
  for (const pb of promptButtons) {
    const pText = await page.evaluate(el => el.innerText, pb);
    if (pText.includes('supervised and unsupervised')) {
      await pb.click();
      await new Promise(r => setTimeout(r, 2000));
      break;
    }
  }
  const tutorPath = path.join(SCREENSHOT_DIR, '03_ai_tutor.png');
  await page.screenshot({ path: tutorPath, fullPage: true });
  fs.copyFileSync(tutorPath, path.join(ARTIFACT_DIR, '03_ai_tutor.png'));

  // 4. Study Planner
  console.log('Capturing 04_study_planner.png...');
  await clickNav('Study Planner');
  const plannerPath = path.join(SCREENSHOT_DIR, '04_study_planner.png');
  await page.screenshot({ path: plannerPath, fullPage: true });
  fs.copyFileSync(plannerPath, path.join(ARTIFACT_DIR, '04_study_planner.png'));

  // 5. My Progress
  console.log('Capturing 05_progress_analytics.png...');
  await clickNav('My Progress');
  const progPath = path.join(SCREENSHOT_DIR, '05_progress_analytics.png');
  await page.screenshot({ path: progPath, fullPage: true });
  fs.copyFileSync(progPath, path.join(ARTIFACT_DIR, '05_progress_analytics.png'));

  // 6. Agent Activity
  console.log('Capturing 06_agent_activity.png...');
  await clickNav('Agent Activity');
  // Trigger one workflow preset
  const execBtns = await page.$$('button');
  for (const eb of execBtns) {
    const ebText = await page.evaluate(el => el.innerText, eb);
    if (ebText.includes('Composite Diagnostic')) {
      await eb.click();
      await new Promise(r => setTimeout(r, 2500));
      break;
    }
  }
  const agentPath = path.join(SCREENSHOT_DIR, '06_agent_activity.png');
  await page.screenshot({ path: agentPath, fullPage: true });
  fs.copyFileSync(agentPath, path.join(ARTIFACT_DIR, '06_agent_activity.png'));

  // 7. About Project
  console.log('Capturing 07_about_project.png...');
  await clickNav('About Project');
  const aboutPath = path.join(SCREENSHOT_DIR, '07_about_project.png');
  await page.screenshot({ path: aboutPath, fullPage: true });
  fs.copyFileSync(aboutPath, path.join(ARTIFACT_DIR, '07_about_project.png'));

  await browser.close();
  console.log('All 7 high-resolution screenshots captured and synchronized successfully!');
}

run().catch(err => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
