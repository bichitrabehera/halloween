# TODO: Modify ForestScene to Show Questions One at a Time

- [x] Add state variables: currentQuestionIndex, attemptsLeft, feedbackText, hintText, chancesText
- [x] Modify create() to display only the current question with input and submit button
- [x] Update handleSubmit() to check only the current answer, handle correct (next question) or wrong (decrement attempts)
- [x] Add method to display next question or finish quiz
- [x] Add logic for game over if attempts run out
- [x] Update score incrementally on correct answers
- [x] Ensure time tracking and transitions to FinishScene or GameOver
- [x] Update shutdown() to clean up DOM elements
- [ ] Test the scene by running the game
