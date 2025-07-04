let scorm = pipwerks.SCORM;
scorm.version = "1.2";

function initSCORM() {
  scorm.init();
}

function setScore(score) {
  scorm.set("cmi.core.score.raw", score);
}

function markComplete() {
  scorm.set("cmi.core.lesson_status", "completed");
  scorm.save();
}

window.onload = initSCORM;
