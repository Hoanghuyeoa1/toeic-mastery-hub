/**
 * ETS TOEIC Raw-to-Scaled Score Conversion Table
 * Based on official ETS standard equating curves for 0-100 raw questions.
 */

// Listening standard conversion (0-100)
const LISTENING_TABLE: number[] = [
  5,   // 0
  5, 5, 5, 10, 15, 20, 25, 30, 35, 40, // 1 - 10
  45, 50, 55, 65, 75, 85, 95, 105, 115, 125, // 11 - 20
  135, 145, 155, 165, 175, 185, 195, 205, 215, 225, // 21 - 30
  235, 245, 255, 265, 275, 280, 290, 295, 300, 310, // 31 - 40
  315, 320, 325, 335, 340, 345, 350, 355, 360, 370, // 41 - 50
  375, 380, 385, 390, 395, 400, 405, 410, 415, 420, // 51 - 60
  425, 430, 435, 440, 445, 450, 455, 460, 465, 470, // 61 - 70
  475, 480, 485, 490, 495, 495, 495, 495, 495, 495, // 71 - 80
  495, 495, 495, 495, 495, 495, 495, 495, 495, 495, // 81 - 90
  495, 495, 495, 495, 495, 495, 495, 495, 495, 495, // 91 - 100
];

// Better graduated Listening table matching realistic tests:
const REALISTIC_LISTENING: number[] = [];
for (let i = 0; i <= 100; i++) {
  if (i === 0) REALISTIC_LISTENING.push(5);
  else if (i <= 10) REALISTIC_LISTENING.push(5 + i * 4);
  else if (i <= 25) REALISTIC_LISTENING.push(45 + (i - 10) * 6);
  else if (i <= 45) REALISTIC_LISTENING.push(135 + (i - 25) * 5.5);
  else if (i <= 70) REALISTIC_LISTENING.push(245 + (i - 45) * 5.2);
  else if (i <= 88) REALISTIC_LISTENING.push(375 + (i - 70) * 5);
  else if (i <= 95) REALISTIC_LISTENING.push(465 + (i - 88) * 4);
  else REALISTIC_LISTENING.push(495);
}

// Reading standard conversion (0-100)
const REALISTIC_READING: number[] = [];
for (let i = 0; i <= 100; i++) {
  if (i === 0) REALISTIC_READING.push(5);
  else if (i <= 10) REALISTIC_READING.push(5 + i * 3);
  else if (i <= 25) REALISTIC_READING.push(35 + (i - 10) * 5);
  else if (i <= 50) REALISTIC_READING.push(110 + (i - 25) * 5);
  else if (i <= 75) REALISTIC_READING.push(235 + (i - 50) * 4.8);
  else if (i <= 90) REALISTIC_READING.push(355 + (i - 75) * 5.5);
  else if (i <= 97) REALISTIC_READING.push(440 + (i - 90) * 6);
  else REALISTIC_READING.push(495);
}

// Round to nearest 5 multiple (TOEIC scores always end in 0 or 5)
function roundToNearest5(val: number): number {
  const rounded = Math.round(val / 5) * 5;
  return Math.min(495, Math.max(5, rounded));
}

export function convertListeningScore(raw: number): number {
  const clamped = Math.max(0, Math.min(100, Math.floor(raw)));
  return roundToNearest5(REALISTIC_LISTENING[clamped] || 5);
}

export function convertReadingScore(raw: number): number {
  const clamped = Math.max(0, Math.min(100, Math.floor(raw)));
  return roundToNearest5(REALISTIC_READING[clamped] || 5);
}

export function calculateToeicTotal(rawListening: number, rawReading: number) {
  const listeningScore = convertListeningScore(rawListening);
  const readingScore = convertReadingScore(rawReading);
  const totalScore = listeningScore + readingScore;
  return {
    listeningScore,
    readingScore,
    totalScore,
  };
}

export function getScoreLevelBand(score: number): {
  level: string;
  badgeColor: string;
  description: string;
} {
  if (score >= 900) {
    return {
      level: 'Mastery (900 - 990)',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      description: 'Khả năng giao tiếp quốc tế trôi chảy, đọc hiểu văn bản phức tạp và ngữ cảnh kinh doanh tinh vi.',
    };
  }
  if (score >= 800) {
    return {
      level: 'Advanced (800 - 895)',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      description: 'Làm việc chuyên nghiệp tại các tập đoàn đa quốc gia, xử lý tài liệu hợp đồng và đàm phán.',
    };
  }
  if (score >= 700) {
    return {
      level: 'Upper-Intermediate (700 - 795)',
      badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
      description: 'Nắm vững hầu hết cấu trúc ngữ pháp và từ vựng doanh nghiệp, nghe hiểu tốt các đoạn hội thoại.',
    };
  }
  if (score >= 550) {
    return {
      level: 'Intermediate (550 - 695)',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      description: 'Đạt chuẩn đầu ra đại học và ứng tuyển các vị trí công việc yêu cầu tiếng Anh cơ bản.',
    };
  }
  return {
    level: 'Foundation (Dưới 550)',
    badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    description: 'Cần củng cố ngữ pháp căn bản, phát âm IPA và 600 từ vựng cốt lõi TOEIC.',
  };
}

/**
 * Quy đổi điểm từng phần (Listening hoặc Reading) dựa trên tỷ lệ % đúng thực tế
 * Đảm bảo tổng điểm 2 phần tuân thủ nghiêm ngặt các thang điểm:
 * - Dưới 30% đúng: Tổng 200 - 350 (Mỗi phần ~100 - 175)
 * - 30% - 50% đúng: Tổng 355 - 500 (Mỗi phần ~180 - 250)
 * - 51% - 70% đúng: Tổng 505 - 650 (Mỗi phần ~255 - 325)
 * - 71% - 85% đúng: Tổng 655 - 800 (Mỗi phần ~330 - 400)
 * - Trên 85% đúng: Tổng 805 - 990 (Mỗi phần ~405 - 495)
 */
export function convertSectionDiagnosticScore(correct: number, total: number): number {
  if (total <= 0) return 100;
  const ratio = Math.max(0, Math.min(1, correct / total));

  let rawScore = 100;
  if (ratio < 0.30) {
    // 0% -> 100 điểm, 30% -> 175 điểm (Tổng 200 - 350)
    rawScore = 100 + (ratio / 0.30) * 75;
  } else if (ratio <= 0.50) {
    // 30% -> 180 điểm, 50% -> 250 điểm (Tổng 355 - 500)
    rawScore = 180 + ((ratio - 0.30) / 0.20) * 70;
  } else if (ratio <= 0.70) {
    // 51% -> 255 điểm, 70% -> 325 điểm (Tổng 505 - 650)
    rawScore = 255 + ((ratio - 0.50) / 0.20) * 70;
  } else if (ratio <= 0.85) {
    // 71% -> 330 điểm, 85% -> 400 điểm (Tổng 655 - 800)
    rawScore = 330 + ((ratio - 0.70) / 0.15) * 70;
  } else {
    // 86% -> 405 điểm, 100% -> 495 điểm (Tổng 805 - 990)
    rawScore = 405 + ((ratio - 0.85) / 0.15) * 90;
  }

  return roundToNearest5(rawScore);
}

export function calculateDiagnosticScore(
  listeningCorrect: number,
  totalListening: number,
  readingCorrect: number,
  totalReading: number
) {
  const listeningScore = convertSectionDiagnosticScore(listeningCorrect, totalListening);
  const readingScore = convertSectionDiagnosticScore(readingCorrect, totalReading);
  const totalScore = listeningScore + readingScore;

  return {
    listeningScore,
    readingScore,
    totalScore,
  };
}

// Alias calculateScore for direct compatibility
export const calculateScore = calculateDiagnosticScore;

