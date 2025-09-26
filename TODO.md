# TODO: Add Navigation Buttons and Improve Timer Handling

## Steps to Complete:
1. [x] **Update Game.ts**: Add scene order array and navigation helper methods (nextScene, prevScene) for handling transitions with state saving/loading and timer management.
2. [x] **Update IntroScene.ts**: Disable back button (no previous scene), ensure forward only to ProphecyScene.
3. [x] **Update ProphecyScene.ts**: Add next/back buttons (back to Intro, next on complete to Forest), change onTimeUp to "OOPS! ELIMINATED!" and go to Intro, remove home button.
4. [x] **Update ForestScene.ts**: Add next/back buttons (back to Prophecy, next on complete to Crypt), update onTimeUp to eliminated message and go to Intro, remove home.
5. [x] **Update CryptScene.ts**: Add next/back buttons (back to Forest, next on complete to Ritual), update onTimeUp to eliminated and go to Intro, remove home.
6. [x] **Update RitualScene.ts**: Add back button (to Crypt), no next, update onTimeUp to eliminated and go to Intro, remove home.
7. [x] **Test Navigation**: Run `npm run dev`, launch browser, verify back/forward between scenes, timer pause/resume on back.
8. [x] **Test Timer Expiry**: Verify "OOPS! ELIMINATED!" message appears and transitions to Intro on timer up.
9. [x] **Verify No Home Buttons**: Ensure home buttons are removed from all puzzle scenes.
10. [x] **Final Testing**: Use browser_action for interactive testing if needed, ensure smooth transitions and best practices.

## Notes:
- Pause timer on back navigation (stop timer event, save timeLeft).
- Resume timer on forward/prev from saved timeLeft.
- Use consistent button styling (similar to IntroScene).
- Fade transitions for navigation.
- Clear state only on elimination or full restart.
- For elimination: Show message, disable interactions, delay then go to Intro.
