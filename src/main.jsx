import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Apple,
  BarChart3,
  CalendarDays,
  Dumbbell,
  Flame,
  HeartPulse,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Utensils,
  UserRound
} from 'lucide-react';
import './styles.css';

const todayKey = () => new Date().toISOString().slice(0, 10);

const defaultProfile = {
  sex: 'male',
  age: 28,
  height: 176,
  weight: 78,
  goal: 'fat_loss',
  activity: 'medium',
  targetExerciseCalories: 420
};

const navItems = [
  ['today', '今日', Activity],
  ['profile', '画像', UserRound],
  ['meals', 'DIY饮食', Utensils],
  ['workout', 'DIY运动', Dumbbell],
  ['calendar', '日历', CalendarDays],
  ['reports', '报告', BarChart3]
];

const goalLabels = { fat_loss: '减脂', recomposition: '塑形', muscle_gain: '增肌', maintain: '维持' };
const activityFactors = { low: 1.35, medium: 1.55, high: 1.75 };
const goalAdjustments = { fat_loss: -420, recomposition: -160, muscle_gain: 260, maintain: 0 };
const mealNames = ['早餐', '午餐', '晚餐', '加餐'];

const baseFoodCatalog = [
  { id: 'rice', name: '米饭', group: '主食', kcal: 116, protein: 2.6, carbs: 25.9, fat: 0.3, tags: ['日常', '训练后'] },
  { id: 'oat', name: '燕麦', group: '主食', kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, tags: ['早餐', '高纤维'] },
  { id: 'sweet_potato', name: '红薯', group: '主食', kcal: 86, protein: 1.6, carbs: 20.1, fat: 0.1, tags: ['饱腹', '减脂'] },
  { id: 'quinoa', name: '藜麦', group: '主食', kcal: 120, protein: 4.4, carbs: 21.3, fat: 1.9, tags: ['高纤维', '替换米饭'] },
  { id: 'corn', name: '玉米', group: '主食', kcal: 112, protein: 3.4, carbs: 22.8, fat: 1.2, tags: ['饱腹', '早餐'] },
  { id: 'noodle', name: '荞麦面', group: '主食', kcal: 99, protein: 5, carbs: 21, fat: 0.1, tags: ['午餐', '替换米饭'] },
  { id: 'toast', name: '全麦吐司', group: '主食', kcal: 247, protein: 13, carbs: 41, fat: 4.2, tags: ['早餐', '方便'] },
  { id: 'chicken', name: '鸡胸肉', group: '蛋白', kcal: 165, protein: 31, carbs: 0, fat: 3.6, tags: ['高蛋白', '低脂'] },
  { id: 'beef', name: '瘦牛肉', group: '蛋白', kcal: 176, protein: 26, carbs: 0, fat: 8, tags: ['增肌', '铁'] },
  { id: 'shrimp', name: '虾仁', group: '蛋白', kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, tags: ['低脂', '高蛋白'] },
  { id: 'egg', name: '鸡蛋', group: '蛋白', kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5, tags: ['早餐', '方便'] },
  { id: 'tofu', name: '北豆腐', group: '蛋白', kcal: 116, protein: 9.2, carbs: 3, fat: 8.1, tags: ['素食', '替换肉类'] },
  { id: 'salmon', name: '三文鱼', group: '蛋白', kcal: 208, protein: 20, carbs: 0, fat: 13, tags: ['优质脂肪', '增肌'] },
  { id: 'cod', name: '鳕鱼', group: '蛋白', kcal: 82, protein: 18, carbs: 0, fat: 0.7, tags: ['低脂', '晚餐'] },
  { id: 'broccoli', name: '西兰花', group: '蔬菜', kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, tags: ['高纤维', '减脂'] },
  { id: 'spinach', name: '菠菜', group: '蔬菜', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, tags: ['低热量', '补铁'] },
  { id: 'pepper', name: '彩椒', group: '蔬菜', kcal: 31, protein: 1, carbs: 6, fat: 0.3, tags: ['维生素', '配菜'] },
  { id: 'lettuce', name: '生菜', group: '蔬菜', kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, tags: ['低热量', '外卖搭配'] },
  { id: 'asparagus', name: '芦笋', group: '蔬菜', kcal: 20, protein: 2.2, carbs: 3.9, fat: 0.1, tags: ['低热量', '配菜'] },
  { id: 'avocado', name: '牛油果', group: '脂肪', kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, tags: ['优质脂肪', '少量'] },
  { id: 'almond', name: '杏仁', group: '脂肪', kcal: 579, protein: 21, carbs: 22, fat: 50, tags: ['加餐', '控量'] },
  { id: 'olive_oil', name: '橄榄油', group: '脂肪', kcal: 884, protein: 0, carbs: 0, fat: 100, tags: ['烹饪', '控量'] },
  { id: 'yogurt', name: '希腊酸奶', group: '乳制品', kcal: 97, protein: 9, carbs: 3.6, fat: 5, tags: ['加餐', '高蛋白'] },
  { id: 'milk', name: '低脂牛奶', group: '乳制品', kcal: 42, protein: 3.4, carbs: 5, fat: 1, tags: ['早餐', '补钙'] },
  { id: 'cheese', name: '低脂奶酪', group: '乳制品', kcal: 72, protein: 12, carbs: 3, fat: 1, tags: ['加餐', '高蛋白'] },
  { id: 'banana', name: '香蕉', group: '水果', kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, tags: ['训练前', '补碳'] },
  { id: 'blueberry', name: '蓝莓', group: '水果', kcal: 57, protein: 0.7, carbs: 14.5, fat: 0.3, tags: ['早餐', '低热量'] },
  { id: 'apple', name: '苹果', group: '水果', kcal: 52, protein: 0.3, carbs: 13.8, fat: 0.2, tags: ['加餐', '饱腹'] },
  { id: 'kiwi', name: '猕猴桃', group: '水果', kcal: 61, protein: 1.1, carbs: 14.7, fat: 0.5, tags: ['维生素', '早餐'] }
];

const exerciseCatalog = [
  { id: 'walk', name: '快走', category: '有氧', met: 4.3, impact: '低', heavySafe: true, place: '户外/跑步机', note: '大体重友好，适合打底消耗' },
  { id: 'incline_walk', name: '坡走', category: '有氧', met: 6.2, impact: '低', heavySafe: true, place: '跑步机', note: '比跑步更护膝，消耗稳定' },
  { id: 'bike', name: '动感单车', category: '有氧', met: 6.8, impact: '低', heavySafe: true, place: '健身房/家', note: '膝盖压力较低，强度可控' },
  { id: 'elliptical', name: '椭圆机', category: '有氧', met: 5.0, impact: '低', heavySafe: true, place: '健身房', note: '低冲击，适合新手和大体重' },
  { id: 'swim', name: '游泳', category: '有氧', met: 6.0, impact: '低', heavySafe: true, place: '泳池', note: '关节压力小，心肺收益高' },
  { id: 'jog', name: '慢跑', category: '有氧', met: 7.0, impact: '高', heavySafe: false, place: '户外/跑步机', note: '大体重或膝踝不适时不优先推荐' },
  { id: 'hiit', name: '跳跃HIIT', category: '有氧', met: 8.5, impact: '高', heavySafe: false, place: '家/健身房', note: '冲击高，新手和大体重谨慎' },
  { id: 'strength_full', name: '全身力量训练', category: '力量', met: 5.5, impact: '中', heavySafe: true, place: '健身房', note: '保肌肉，提高长期消耗' },
  { id: 'dumbbell', name: '哑铃循环', category: '力量', met: 5.0, impact: '中', heavySafe: true, place: '家/健身房', note: '时间短，动作可替换' },
  { id: 'mobility', name: '拉伸活动度', category: '恢复', met: 2.3, impact: '低', heavySafe: true, place: '家', note: '恢复日使用，不作为主要消耗' }
];

const mealTemplates = [
  {
    id: 'fat_loss_cn',
    name: '减脂中餐',
    target: '减脂',
    items: [
      { meal: '早餐', foodId: 'oat', ratio: 0.018 },
      { meal: '早餐', foodId: 'egg', ratio: 0.04 },
      { meal: '早餐', foodId: 'milk', ratio: 0.08 },
      { meal: '午餐', foodId: 'rice', ratio: 0.055 },
      { meal: '午餐', foodId: 'chicken', ratio: 0.06 },
      { meal: '午餐', foodId: 'broccoli', ratio: 0.08 },
      { meal: '晚餐', foodId: 'sweet_potato', ratio: 0.08 },
      { meal: '晚餐', foodId: 'shrimp', ratio: 0.065 },
      { meal: '晚餐', foodId: 'spinach', ratio: 0.08 },
      { meal: '加餐', foodId: 'yogurt', ratio: 0.06 }
    ]
  },
  {
    id: 'muscle_gain_simple',
    name: '增肌高蛋白',
    target: '增肌',
    items: [
      { meal: '早餐', foodId: 'toast', ratio: 0.05 },
      { meal: '早餐', foodId: 'egg', ratio: 0.055 },
      { meal: '早餐', foodId: 'milk', ratio: 0.1 },
      { meal: '午餐', foodId: 'rice', ratio: 0.075 },
      { meal: '午餐', foodId: 'beef', ratio: 0.065 },
      { meal: '午餐', foodId: 'pepper', ratio: 0.06 },
      { meal: '晚餐', foodId: 'quinoa', ratio: 0.07 },
      { meal: '晚餐', foodId: 'salmon', ratio: 0.06 },
      { meal: '晚餐', foodId: 'asparagus', ratio: 0.06 },
      { meal: '加餐', foodId: 'banana', ratio: 0.045 },
      { meal: '加餐', foodId: 'yogurt', ratio: 0.07 }
    ]
  },
  {
    id: 'vegetarian_light',
    name: '轻素食',
    target: '塑形',
    items: [
      { meal: '早餐', foodId: 'oat', ratio: 0.02 },
      { meal: '早餐', foodId: 'milk', ratio: 0.09 },
      { meal: '早餐', foodId: 'blueberry', ratio: 0.04 },
      { meal: '午餐', foodId: 'quinoa', ratio: 0.08 },
      { meal: '午餐', foodId: 'tofu', ratio: 0.09 },
      { meal: '午餐', foodId: 'broccoli', ratio: 0.08 },
      { meal: '晚餐', foodId: 'sweet_potato', ratio: 0.08 },
      { meal: '晚餐', foodId: 'tofu', ratio: 0.08 },
      { meal: '晚餐', foodId: 'lettuce', ratio: 0.08 },
      { meal: '加餐', foodId: 'almond', ratio: 0.008 },
      { meal: '加餐', foodId: 'apple', ratio: 0.06 }
    ]
  },
  {
    id: 'office_low_fat',
    name: '上班低脂',
    target: '控热量',
    items: [
      { meal: '早餐', foodId: 'toast', ratio: 0.035 },
      { meal: '早餐', foodId: 'egg', ratio: 0.045 },
      { meal: '早餐', foodId: 'blueberry', ratio: 0.035 },
      { meal: '午餐', foodId: 'rice', ratio: 0.05 },
      { meal: '午餐', foodId: 'cod', ratio: 0.075 },
      { meal: '午餐', foodId: 'lettuce', ratio: 0.08 },
      { meal: '晚餐', foodId: 'corn', ratio: 0.065 },
      { meal: '晚餐', foodId: 'chicken', ratio: 0.06 },
      { meal: '晚餐', foodId: 'pepper', ratio: 0.07 },
      { meal: '加餐', foodId: 'apple', ratio: 0.055 }
    ]
  },
  {
    id: 'training_day',
    name: '训练日补碳',
    target: '训练日',
    items: [
      { meal: '早餐', foodId: 'oat', ratio: 0.024 },
      { meal: '早餐', foodId: 'banana', ratio: 0.045 },
      { meal: '早餐', foodId: 'milk', ratio: 0.095 },
      { meal: '午餐', foodId: 'rice', ratio: 0.08 },
      { meal: '午餐', foodId: 'chicken', ratio: 0.07 },
      { meal: '午餐', foodId: 'broccoli', ratio: 0.075 },
      { meal: '晚餐', foodId: 'noodle', ratio: 0.085 },
      { meal: '晚餐', foodId: 'beef', ratio: 0.06 },
      { meal: '晚餐', foodId: 'spinach', ratio: 0.07 },
      { meal: '加餐', foodId: 'yogurt', ratio: 0.075 }
    ]
  },
  {
    id: 'heavy_safe_loss',
    name: '大体重友好',
    target: '稳态减脂',
    items: [
      { meal: '早餐', foodId: 'oat', ratio: 0.018 },
      { meal: '早餐', foodId: 'egg', ratio: 0.038 },
      { meal: '早餐', foodId: 'kiwi', ratio: 0.04 },
      { meal: '午餐', foodId: 'sweet_potato', ratio: 0.075 },
      { meal: '午餐', foodId: 'shrimp', ratio: 0.07 },
      { meal: '午餐', foodId: 'broccoli', ratio: 0.095 },
      { meal: '晚餐', foodId: 'rice', ratio: 0.045 },
      { meal: '晚餐', foodId: 'cod', ratio: 0.08 },
      { meal: '晚餐', foodId: 'lettuce', ratio: 0.09 },
      { meal: '加餐', foodId: 'milk', ratio: 0.08 }
    ]
  },
  {
    id: 'budget_high_protein',
    name: '平价高蛋白',
    target: '实用',
    items: [
      { meal: '早餐', foodId: 'egg', ratio: 0.05 },
      { meal: '早餐', foodId: 'milk', ratio: 0.1 },
      { meal: '早餐', foodId: 'toast', ratio: 0.035 },
      { meal: '午餐', foodId: 'rice', ratio: 0.065 },
      { meal: '午餐', foodId: 'chicken', ratio: 0.075 },
      { meal: '午餐', foodId: 'pepper', ratio: 0.065 },
      { meal: '晚餐', foodId: 'corn', ratio: 0.07 },
      { meal: '晚餐', foodId: 'tofu', ratio: 0.09 },
      { meal: '晚餐', foodId: 'spinach', ratio: 0.08 },
      { meal: '加餐', foodId: 'yogurt', ratio: 0.06 }
    ]
  }
];

function loadStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function loadMerged(key, fallback) {
  const stored = loadStored(key, fallback);
  return { ...fallback, ...stored };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeName(name) {
  return String(name).trim().toLowerCase();
}

function estimateCaloriesBurned(met, weightKg, minutes) {
  return Math.round((met * 3.5 * weightKg / 200) * minutes);
}

function estimateExerciseHourly(exercise, weightKg) {
  if (exercise.kcalPerHour) return Number(exercise.kcalPerHour);
  return estimateCaloriesBurned(exercise.met, weightKg, 60);
}

function estimateExerciseCalories(exercise, weightKg, minutes) {
  return Math.round((estimateExerciseHourly(exercise, weightKg) / 60) * Number(minutes));
}

function calculateTargets(profile) {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const bmrBase = 10 * weight + 6.25 * height - 5 * age;
  const bmr = Math.round(profile.sex === 'female' ? bmrBase - 161 : bmrBase + 5);
  const tdee = Math.round(bmr * activityFactors[profile.activity]);
  const calories = clamp(Math.round(tdee + goalAdjustments[profile.goal]), 1300, 3600);
  const protein = Math.round(weight * (profile.goal === 'muscle_gain' ? 2 : 1.8));
  const fat = Math.round((calories * 0.27) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const bmi = Math.round((weight / ((height / 100) ** 2)) * 10) / 10;
  return { bmr, tdee, calories, protein, fat, carbs, bmi };
}

function createDefaultMeals() {
  return {
    早餐: [{ foodId: 'oat', grams: 50 }, { foodId: 'egg', grams: 100 }, { foodId: 'milk', grams: 250 }, { foodId: 'blueberry', grams: 80 }],
    午餐: [{ foodId: 'rice', grams: 150 }, { foodId: 'chicken', grams: 160 }, { foodId: 'broccoli', grams: 220 }],
    晚餐: [{ foodId: 'sweet_potato', grams: 220 }, { foodId: 'shrimp', grams: 180 }, { foodId: 'spinach', grams: 200 }],
    加餐: [{ foodId: 'yogurt', grams: 180 }, { foodId: 'almond', grams: 8 }]
  };
}

function createDefaultExercises() {
  return [{ exerciseId: 'incline_walk', minutes: 22 }, { exerciseId: 'strength_full', minutes: 32 }, { exerciseId: 'mobility', minutes: 8 }];
}

function applyMealTemplate(template, targetCalories) {
  const nextMeals = { 早餐: [], 午餐: [], 晚餐: [], 加餐: [] };
  template.items.forEach((item) => {
    nextMeals[item.meal].push({
      foodId: item.foodId,
      grams: Math.max(8, Math.round(Number(targetCalories) * item.ratio))
    });
  });
  return nextMeals;
}

function sumMeal(meals, foods) {
  const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  Object.values(meals).flat().forEach((item) => {
    const food = foods.find((entry) => entry.id === item.foodId);
    if (!food) return;
    const factor = Number(item.grams) / 100;
    totals.kcal += food.kcal * factor;
    totals.protein += food.protein * factor;
    totals.carbs += food.carbs * factor;
    totals.fat += food.fat * factor;
  });
  return { kcal: Math.round(totals.kcal), protein: Math.round(totals.protein), carbs: Math.round(totals.carbs), fat: Math.round(totals.fat) };
}

function sumWorkout(exercises, weight, allExercises = exerciseCatalog) {
  return exercises.reduce((sum, item) => {
    const exercise = allExercises.find((entry) => entry.id === item.exerciseId);
    return exercise ? sum + estimateExerciseCalories(exercise, Number(weight), Number(item.minutes)) : sum;
  }, 0);
}

function buildRecords(dailyRecords, startDate) {
  const start = new Date(startDate);
  const end = new Date(todayKey());
  const records = [];
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const key = date.toISOString().slice(0, 10);
    records.push({ date: key, ...(dailyRecords[key] ?? { kcal: 0, exercise: 0, score: 0, empty: true }) });
  }
  return records;
}

function ProfileControl({ label, children }) {
  return <label className="profile-control"><span>{label}</span>{children}</label>;
}

function Ring({ value, label, sublabel, color }) {
  const angle = Math.round(value * 3.6);
  return <div className="ring" style={{ '--angle': `${angle}deg`, '--ring-color': color }}><div className="ring-core"><strong>{value}%</strong><span>{label}</span><small>{sublabel}</small></div></div>;
}

function DonutChart({ mealTotals, workoutCalories, targets }) {
  const proteinKcal = mealTotals.protein * 4;
  const carbsKcal = mealTotals.carbs * 4;
  const fatKcal = mealTotals.fat * 9;
  const remaining = Math.max(0, targets.calories - mealTotals.kcal);
  const total = Math.max(1, proteinKcal + carbsKcal + fatKcal + remaining);
  const p1 = (proteinKcal / total) * 100;
  const p2 = p1 + (carbsKcal / total) * 100;
  const p3 = p2 + (fatKcal / total) * 100;
  const burnRate = clamp(Math.round((workoutCalories / Math.max(1, targets.exerciseTarget || 1)) * 100), 0, 100);

  return (
    <div className="donut-wrap">
      <div
        className="donut-chart"
        style={{
          '--p1': `${p1}%`,
          '--p2': `${p2}%`,
          '--p3': `${p3}%`,
          '--burn': `${burnRate}%`
        }}
      >
        <div><strong>{mealTotals.kcal}</strong><span>kcal</span></div>
      </div>
      <div className="donut-legend">
        <span><i className="protein-dot" />蛋白</span>
        <span><i className="carbs-dot" />碳水</span>
        <span><i className="fat-dot" />脂肪</span>
        <span><i className="remain-dot" />剩余</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, title, value, caption, tone }) {
  return <div className={`metric-card ${tone}`}><Icon size={22} /><span>{title}</span><strong>{value}</strong><small>{caption}</small></div>;
}

function ProfilePanel({ profile, setProfile, targets }) {
  const setField = (field, value) => setProfile({ ...profile, [field]: value });
  return (
    <section className="section-panel profile-panel">
      <div className="section-head"><div><p>Profile</p><h2>个人目标</h2></div><span>BMI {targets.bmi}</span></div>
      <div className="profile-grid">
        <ProfileControl label="性别"><select value={profile.sex} onChange={(event) => setField('sex', event.target.value)}><option value="male">男</option><option value="female">女</option></select></ProfileControl>
        <ProfileControl label="年龄"><input type="number" value={profile.age} onChange={(event) => setField('age', event.target.value)} /></ProfileControl>
        <ProfileControl label="身高 cm"><input type="number" value={profile.height} onChange={(event) => setField('height', event.target.value)} /></ProfileControl>
        <ProfileControl label="体重 kg"><input type="number" value={profile.weight} onChange={(event) => setField('weight', event.target.value)} /></ProfileControl>
        <ProfileControl label="目标"><select value={profile.goal} onChange={(event) => setField('goal', event.target.value)}><option value="fat_loss">减脂</option><option value="recomposition">塑形</option><option value="muscle_gain">增肌</option><option value="maintain">维持</option></select></ProfileControl>
        <ProfileControl label="活动量"><select value={profile.activity} onChange={(event) => setField('activity', event.target.value)}><option value="low">低</option><option value="medium">中</option><option value="high">高</option></select></ProfileControl>
        <ProfileControl label="每日想消耗 kcal"><input type="number" value={profile.targetExerciseCalories} onChange={(event) => setField('targetExerciseCalories', event.target.value)} /></ProfileControl>
      </div>
      <div className="profile-result">
        <div><small>基础代谢</small><strong>{targets.bmr}</strong><span>kcal</span></div>
        <div><small>总消耗</small><strong>{targets.tdee}</strong><span>kcal</span></div>
        <div><small>建议摄入</small><strong>{targets.calories}</strong><span>kcal</span></div>
      </div>
    </section>
  );
}

function AddFoodPanel({ allFoods, customFoods, setCustomFoods }) {
  const [draft, setDraft] = useState({ name: '', group: '自定义', kcal: 100, protein: 0, carbs: 0, fat: 0, tags: '自定义' });
  const [error, setError] = useState('');
  const setField = (field, value) => setDraft({ ...draft, [field]: value });

  const addFood = () => {
    const name = draft.name.trim();
    if (!name) return setError('请输入食物名称');
    if (allFoods.some((food) => normalizeName(food.name) === normalizeName(name))) return setError('这个食物已经存在，不能重复添加');
    const food = {
      id: `custom_${Date.now()}`,
      name,
      group: draft.group.trim() || '自定义',
      kcal: Number(draft.kcal) || 0,
      protein: Number(draft.protein) || 0,
      carbs: Number(draft.carbs) || 0,
      fat: Number(draft.fat) || 0,
      tags: draft.tags.split(/[，,]/).map((item) => item.trim()).filter(Boolean),
      custom: true
    };
    setCustomFoods([...customFoods, food]);
    setDraft({ name: '', group: '自定义', kcal: 100, protein: 0, carbs: 0, fat: 0, tags: '自定义' });
    setError('');
  };

  const deleteCustom = (id) => setCustomFoods(customFoods.filter((food) => food.id !== id));

  return (
    <div className="add-food-panel">
      <h3>添加自定义食物</h3>
      <div className="custom-food-grid">
        <label><span>食物名称</span><input placeholder="例如：鸡腿肉" value={draft.name} onChange={(event) => setField('name', event.target.value)} /></label>
        <label><span>品类</span><input placeholder="例如：蛋白" value={draft.group} onChange={(event) => setField('group', event.target.value)} /></label>
        <label><span>热量 kcal/100g</span><input type="number" value={draft.kcal} onChange={(event) => setField('kcal', event.target.value)} /></label>
        <label><span>蛋白 g/100g</span><input type="number" value={draft.protein} onChange={(event) => setField('protein', event.target.value)} /></label>
        <label><span>碳水 g/100g</span><input type="number" value={draft.carbs} onChange={(event) => setField('carbs', event.target.value)} /></label>
        <label><span>脂肪 g/100g</span><input type="number" value={draft.fat} onChange={(event) => setField('fat', event.target.value)} /></label>
        <label><span>标签</span><input placeholder="用逗号分隔" value={draft.tags} onChange={(event) => setField('tags', event.target.value)} /></label>
        <button onClick={addFood}><Plus size={16} />添加食物</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      {customFoods.length > 0 && <div className="custom-food-list">{customFoods.map((food) => <span key={food.id}>{food.name}<button onClick={() => deleteCustom(food.id)}><Trash2 size={13} /></button></span>)}</div>}
    </div>
  );
}

function AddExercisePanel({ allExercises, customExercises, setCustomExercises }) {
  const [draft, setDraft] = useState({ name: '', category: '自定义', kcalPerHour: 300, impact: '低', place: '家/健身房', note: '自定义运动', heavySafe: true });
  const [error, setError] = useState('');
  const setField = (field, value) => setDraft({ ...draft, [field]: value });

  const addExercise = () => {
    const name = draft.name.trim();
    if (!name) return setError('请输入运动名称');
    if (allExercises.some((exercise) => normalizeName(exercise.name) === normalizeName(name))) return setError('这个运动已经存在，不能重复添加');
    setCustomExercises([
      ...customExercises,
      {
        id: `custom_ex_${Date.now()}`,
        name,
        category: draft.category.trim() || '自定义',
        kcalPerHour: Number(draft.kcalPerHour) || 0,
        impact: draft.impact,
        heavySafe: Boolean(draft.heavySafe),
        place: draft.place.trim() || '自定义',
        note: draft.note.trim() || '自定义运动',
        custom: true
      }
    ]);
    setDraft({ name: '', category: '自定义', kcalPerHour: 300, impact: '低', place: '家/健身房', note: '自定义运动', heavySafe: true });
    setError('');
  };

  const deleteCustom = (id) => setCustomExercises(customExercises.filter((exercise) => exercise.id !== id));

  return (
    <div className="add-food-panel">
      <h3>添加自定义运动</h3>
      <div className="custom-food-grid">
        <label><span>运动名称</span><input placeholder="例如：爬楼机" value={draft.name} onChange={(event) => setField('name', event.target.value)} /></label>
        <label><span>类型</span><input placeholder="例如：有氧" value={draft.category} onChange={(event) => setField('category', event.target.value)} /></label>
        <label><span>每小时消耗 kcal</span><input type="number" value={draft.kcalPerHour} onChange={(event) => setField('kcalPerHour', event.target.value)} /></label>
        <label><span>冲击等级</span><select value={draft.impact} onChange={(event) => setField('impact', event.target.value)}><option value="低">低</option><option value="中">中</option><option value="高">高</option></select></label>
        <label><span>场景</span><input value={draft.place} onChange={(event) => setField('place', event.target.value)} /></label>
        <label><span>说明</span><input value={draft.note} onChange={(event) => setField('note', event.target.value)} /></label>
        <label className="checkbox-line"><span>大体重可推荐</span><input type="checkbox" checked={draft.heavySafe} onChange={(event) => setField('heavySafe', event.target.checked)} /></label>
        <button onClick={addExercise}><Plus size={16} />添加运动</button>
      </div>
      {error && <p className="form-error">{error}</p>}
      {customExercises.length > 0 && <div className="custom-food-list">{customExercises.map((exercise) => <span key={exercise.id}>{exercise.name}<button onClick={() => deleteCustom(exercise.id)}><Trash2 size={13} /></button></span>)}</div>}
    </div>
  );
}

function MealsPanel({ meals, setMeals, selectedMeal, setSelectedMeal, targets, allFoods, customFoods, setCustomFoods }) {
  const [query, setQuery] = useState('');
  const totals = sumMeal(meals, allFoods);
  const currentItems = meals[selectedMeal] ?? [];
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filteredFoods = allFoods.filter((food) => {
    if (keywords.length === 0) return true;
    const fields = [food.name, food.group, ...food.tags].map((item) => item.toLowerCase());
    return keywords.every((keyword) => fields.some((field) => field.includes(keyword)));
  });
  const addFood = (foodId) => setMeals({ ...meals, [selectedMeal]: [...currentItems, { foodId, grams: 100 }] });
  const applyTemplate = (template) => setMeals(applyMealTemplate(template, targets.calories));
  const removeFood = (index) => setMeals({ ...meals, [selectedMeal]: currentItems.filter((_, itemIndex) => itemIndex !== index) });
  const updateGrams = (index, grams) => setMeals({ ...meals, [selectedMeal]: currentItems.map((item, itemIndex) => itemIndex === index ? { ...item, grams } : item) });

  return (
    <section className="section-panel meals diy-panel">
      <div className="section-head"><div><p>DIY Meals</p><h2>自选饮食</h2></div><span>{totals.kcal} / {targets.calories} kcal</span></div>
      <div className="template-strip">
        {mealTemplates.map((template) => (
          <button key={template.id} onClick={() => applyTemplate(template)}>
            <strong>{template.name}</strong>
            <span>{template.target} · 按 {targets.calories} kcal 换算克重</span>
          </button>
        ))}
      </div>
      <div className="tabs">{mealNames.map((name) => <button className={selectedMeal === name ? 'active' : ''} key={name} onClick={() => setSelectedMeal(name)}>{name}</button>)}</div>
      <div className="search-row"><Search size={17} /><input placeholder="搜索食物、品类或标签" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <AddFoodPanel allFoods={allFoods} customFoods={customFoods} setCustomFoods={setCustomFoods} />
      <div className="builder-grid">
        <div className="food-library">
          {filteredFoods.map((food) => (
            <button key={food.id} onClick={() => addFood(food.id)}>
              <strong>{food.name}</strong><span>{food.group} · {food.kcal} kcal/100g</span><small>{food.tags.join(' / ')}</small><Plus size={16} />
            </button>
          ))}
        </div>
        <div className="selected-list">
          <h3>{selectedMeal} 已选</h3>
          {currentItems.map((item, index) => {
            const food = allFoods.find((entry) => entry.id === item.foodId);
            if (!food) return null;
            const kcal = Math.round(food.kcal * Number(item.grams) / 100);
            return (
              <div className="selected-row" key={`${item.foodId}-${index}`}>
                <div><strong>{food.name}</strong><span>{kcal} kcal</span></div>
                <input type="number" value={item.grams} onChange={(event) => updateGrams(index, event.target.value)} />
                <button onClick={() => removeFood(index)}><Trash2 size={16} /></button>
              </div>
            );
          })}
          <div className="macro-summary"><span>蛋白 {totals.protein}g</span><span>碳水 {totals.carbs}g</span><span>脂肪 {totals.fat}g</span></div>
        </div>
      </div>
    </section>
  );
}

function WorkoutPanel({ profile, selectedExercises, setSelectedExercises, targets, allExercises, customExercises, setCustomExercises }) {
  const [query, setQuery] = useState('');
  const isHeavy = targets.bmi >= 30;
  const currentCalories = sumWorkout(selectedExercises, profile.weight, allExercises);
  const addExercise = (exerciseId) => setSelectedExercises([...selectedExercises, { exerciseId, minutes: 20 }]);
  const removeExercise = (index) => setSelectedExercises(selectedExercises.filter((_, itemIndex) => itemIndex !== index));
  const updateMinutes = (index, minutes) => setSelectedExercises(selectedExercises.map((item, itemIndex) => itemIndex === index ? { ...item, minutes } : item));
  const keywords = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const recommended = allExercises.filter((exercise) => {
    if (isHeavy && !exercise.heavySafe) return false;
    if (keywords.length === 0) return true;
    const fields = [exercise.name, exercise.category, exercise.impact, exercise.place, exercise.note].map((item) => String(item).toLowerCase());
    return keywords.every((keyword) => fields.some((field) => field.includes(keyword)));
  });

  return (
    <section className="section-panel workout diy-panel">
      <div className="section-head"><div><p>DIY Workout</p><h2>自选运动</h2></div><span>{currentCalories} / {profile.targetExerciseCalories} kcal</span></div>
      {isHeavy && <div className="risk-note"><ShieldCheck size={18} /> 当前 BMI {targets.bmi}，优先推荐低冲击运动；慢跑、跳跃 HIIT 不作为首选。</div>}
      <div className="search-row"><Search size={17} /><input placeholder="搜索运动、类型、场景或说明" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
      <AddExercisePanel allExercises={allExercises} customExercises={customExercises} setCustomExercises={setCustomExercises} />
      <div className="builder-grid">
        <div className="exercise-library">
          {recommended.map((exercise) => (
            <button key={exercise.id} onClick={() => addExercise(exercise.id)}>
              <strong>{exercise.name}</strong><span>{exercise.category} · 约 {estimateExerciseHourly(exercise, Number(profile.weight))} kcal/小时 · {exercise.impact}冲击</span><small>{exercise.note}</small><Plus size={16} />
            </button>
          ))}
        </div>
        <div className="selected-list">
          <h3>今日运动组合</h3>
          {selectedExercises.map((item, index) => {
            const exercise = allExercises.find((entry) => entry.id === item.exerciseId);
            if (!exercise) return null;
            const kcal = estimateExerciseCalories(exercise, Number(profile.weight), Number(item.minutes));
            return (
              <div className="selected-row" key={`${item.exerciseId}-${index}`}>
                <div><strong>{exercise.name}</strong><span>{item.minutes} 分钟 · {kcal} kcal</span></div>
                <input type="number" value={item.minutes} onChange={(event) => updateMinutes(index, event.target.value)} />
                <button onClick={() => removeExercise(index)}><Trash2 size={16} /></button>
              </div>
            );
          })}
          <div className="macro-summary"><span>目标 {profile.targetExerciseCalories} kcal</span><span>当前 {currentCalories} kcal</span><span>差额 {Number(profile.targetExerciseCalories) - currentCalories} kcal</span></div>
        </div>
      </div>
    </section>
  );
}

function CalendarPanel({ records, startDate }) {
  return (
    <section className="section-panel calendar-panel">
      <div className="section-head"><div><p>Calendar</p><h2>记录日历</h2></div><span>从 {startDate} 开始</span></div>
      <div className="calendar-grid">
        {records.map((record) => (
          <div className={`calendar-day ${record.empty ? 'empty' : ''}`} key={record.date}>
            <strong>{record.date.slice(5)}</strong><span>{record.empty ? '未记录' : `${record.kcal} kcal`}</span><small>{record.empty ? '等待使用' : `运动 ${record.exercise}`}</small><i style={{ height: `${record.score}%` }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportsPanel({ records, targets }) {
  const valid = records.filter((record) => !record.empty);
  const week = valid.slice(-7);
  const month = valid.slice(-30);
  const avg = (items, key) => items.length ? Math.round(items.reduce((sum, item) => sum + item[key], 0) / items.length) : 0;
  const weekKcal = avg(week, 'kcal');
  const weekExercise = avg(week, 'exercise');
  const monthKcal = avg(month, 'kcal');
  const monthExercise = avg(month, 'exercise');
  return (
    <section className="section-panel reports-panel">
      <div className="section-head"><div><p>Reports</p><h2>周/月报告</h2></div><span>{valid.length} 天记录</span></div>
      <div className="report-grid"><div><small>周均摄入</small><strong>{weekKcal}</strong><span>kcal / 天</span></div><div><small>周均运动</small><strong>{weekExercise}</strong><span>kcal / 天</span></div><div><small>月均摄入</small><strong>{monthKcal}</strong><span>kcal / 天</span></div><div><small>月均运动</small><strong>{monthExercise}</strong><span>kcal / 天</span></div></div>
    </section>
  );
}

function App() {
  const [activeView, setActiveView] = useState(() => loadStored('fit-orbit-active-view', 'today'));
  const [profile, setProfile] = useState(() => loadMerged('fit-orbit-profile', defaultProfile));
  const [customFoods, setCustomFoods] = useState(() => loadStored('fit-orbit-custom-foods', []));
  const [customExercises, setCustomExercises] = useState(() => loadStored('fit-orbit-custom-exercises', []));
  const [meals, setMeals] = useState(() => loadStored('fit-orbit-diy-meals', createDefaultMeals()));
  const [selectedMeal, setSelectedMeal] = useState(() => loadStored('fit-orbit-selected-meal', '早餐'));
  const [selectedExercises, setSelectedExercises] = useState(() => loadStored('fit-orbit-diy-exercises', createDefaultExercises()));
  const [startDate] = useState(() => loadStored('fit-orbit-start-date', todayKey()));
  const [dailyRecords, setDailyRecords] = useState(() => loadStored('fit-orbit-daily-records', {}));

  const allFoods = useMemo(() => [...baseFoodCatalog, ...customFoods], [customFoods]);
  const allExercises = useMemo(() => [...exerciseCatalog, ...customExercises], [customExercises]);
  const targets = useMemo(() => calculateTargets(profile), [profile]);
  const displayTargets = useMemo(() => ({ ...targets, exerciseTarget: Number(profile.targetExerciseCalories) }), [targets, profile.targetExerciseCalories]);
  const mealTotals = useMemo(() => sumMeal(meals, allFoods), [meals, allFoods]);
  const workoutCalories = useMemo(() => sumWorkout(selectedExercises, profile.weight, allExercises), [selectedExercises, profile.weight, allExercises]);
  const calorieRate = clamp(Math.round((mealTotals.kcal / targets.calories) * 100), 0, 130);
  const burnRate = clamp(Math.round((workoutCalories / Number(profile.targetExerciseCalories)) * 100), 0, 130);
  const records = useMemo(() => buildRecords(dailyRecords, startDate), [dailyRecords, startDate]);

  useEffect(() => { localStorage.setItem('fit-orbit-start-date', JSON.stringify(startDate)); }, [startDate]);
  useEffect(() => { localStorage.setItem('fit-orbit-active-view', JSON.stringify(activeView)); }, [activeView]);
  useEffect(() => { localStorage.setItem('fit-orbit-profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fit-orbit-custom-foods', JSON.stringify(customFoods)); }, [customFoods]);
  useEffect(() => { localStorage.setItem('fit-orbit-custom-exercises', JSON.stringify(customExercises)); }, [customExercises]);
  useEffect(() => { localStorage.setItem('fit-orbit-diy-meals', JSON.stringify(meals)); }, [meals]);
  useEffect(() => { localStorage.setItem('fit-orbit-selected-meal', JSON.stringify(selectedMeal)); }, [selectedMeal]);
  useEffect(() => { localStorage.setItem('fit-orbit-diy-exercises', JSON.stringify(selectedExercises)); }, [selectedExercises]);
  useEffect(() => {
    const score = clamp(Math.round((calorieRate > 0 ? 45 : 0) + (burnRate > 0 ? 45 : 0) + (mealTotals.protein >= targets.protein * 0.8 ? 10 : 0)), 0, 100);
    const next = { ...dailyRecords, [todayKey()]: { kcal: mealTotals.kcal, exercise: workoutCalories, score } };
    setDailyRecords(next);
    localStorage.setItem('fit-orbit-daily-records', JSON.stringify(next));
  }, [mealTotals.kcal, mealTotals.protein, workoutCalories, calorieRate, burnRate, targets.protein]);

  const profilePanel = <ProfilePanel profile={profile} setProfile={setProfile} targets={targets} />;
  const mealsPanel = <MealsPanel meals={meals} setMeals={setMeals} selectedMeal={selectedMeal} setSelectedMeal={setSelectedMeal} targets={targets} allFoods={allFoods} customFoods={customFoods} setCustomFoods={setCustomFoods} />;
  const workoutPanel = <WorkoutPanel profile={profile} selectedExercises={selectedExercises} setSelectedExercises={setSelectedExercises} targets={targets} allExercises={allExercises} customExercises={customExercises} setCustomExercises={setCustomExercises} />;
  const calendarPanel = <CalendarPanel records={records} startDate={startDate} />;
  const reportsPanel = <ReportsPanel records={records} targets={targets} />;
  const content = { profile: <section className="single-view">{profilePanel}</section>, meals: <section className="single-view wide-view">{mealsPanel}</section>, workout: <section className="single-view wide-view">{workoutPanel}</section>, calendar: <section className="single-view">{calendarPanel}</section>, reports: <section className="single-view">{reportsPanel}</section>, today: <section className="dashboard-grid">{profilePanel}{mealsPanel}{workoutPanel}{calendarPanel}</section> }[activeView] ?? <section className="dashboard-grid">{profilePanel}{mealsPanel}{workoutPanel}{calendarPanel}</section>;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><HeartPulse size={24} /></div><div><strong>Fit Orbit</strong><span>DIY Fitness Planner</span></div></div>
        <nav>{navItems.map(([id, label, Icon]) => <button className={activeView === id ? 'active' : ''} key={id} onClick={() => setActiveView(id)}><Icon size={19} /><span>{label}</span></button>)}</nav>
        <section className="safety-card"><ShieldCheck size={20} /><div><strong>建议不是命令</strong><p>用户可自选饮食和运动；大体重默认过滤高冲击推荐。</p></div></section>
      </aside>
      <section className="content">
        <header className="topbar"><div><p>DIY 计划 · {goalLabels[profile.goal]} · BMI {targets.bmi}</p><h1>自己选择，系统负责计算和记录</h1></div></header>
        <section className="hero-grid">
          <article className="command-panel"><div className="panel-title"><span><Flame size={18} /> 今日总览</span><button className="ghost-button" onClick={() => setActiveView('calendar')}>看日历</button></div><div className="hero-copy"><h2>今日目标消耗 {profile.targetExerciseCalories} kcal，当前估算 {workoutCalories} kcal。</h2><p>饮食由你自己选择，系统只计算克重、热量和宏量营养。运动推荐会根据 BMI 和冲击等级筛选，大体重优先推荐快走、坡走、单车、椭圆机、游泳和力量训练。</p></div><DonutChart mealTotals={mealTotals} workoutCalories={workoutCalories} targets={displayTargets} /></article>
          <div className="rings-panel"><Ring value={Math.min(100, calorieRate)} label="摄入" sublabel={`${mealTotals.kcal} / ${targets.calories} kcal`} color="#f06d4f" /><Ring value={Math.min(100, burnRate)} label="运动" sublabel={`${workoutCalories} / ${profile.targetExerciseCalories} kcal`} color="#4568f0" /><Ring value={Math.min(100, Math.round((mealTotals.protein / targets.protein) * 100))} label="蛋白" sublabel={`${mealTotals.protein} / ${targets.protein}g`} color="#2f9d7e" /></div>
        </section>
        <section className="metric-row"><MetricCard icon={Apple} title="摄入热量" value={`${mealTotals.kcal}`} caption={`目标 ${targets.calories} kcal`} tone="green" /><MetricCard icon={Dumbbell} title="运动消耗" value={`${workoutCalories}`} caption={`自设目标 ${profile.targetExerciseCalories} kcal`} tone="blue" /><MetricCard icon={BarChart3} title="蛋白质" value={`${mealTotals.protein}g`} caption={`目标 ${targets.protein}g`} tone="violet" /><MetricCard icon={Flame} title="热量差" value={`${targets.calories - mealTotals.kcal}`} caption="正数表示还可摄入" tone="warm" /></section>
        {content}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
