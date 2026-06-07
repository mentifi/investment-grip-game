const INITIAL_ASSET = 1000000;
const MAX_TURN = 20;

const stockTypes = [
  {
    id: "ai",
    name: "AI半導体株",
    description: "期待リターン：高い / 値動き：激しい / 材料：AI・GPU・データセンター",
    multiplier: 1.15
  },
  {
    id: "space",
    name: "宇宙開発株",
    description: "期待リターン：夢 / 値動き：地獄 / 材料：打ち上げ・増資・契約延期",
    multiplier: 1.45
  },
  {
    id: "fintech",
    name: "フィンテック株",
    description: "期待リターン：中〜高 / 値動き：中 / 材料：金利・黒字化・貸倒率",
    multiplier: 0.9
  },
  {
    id: "dividend",
    name: "高配当株",
    description: "期待リターン：ほどほど / 値動き：安定 / 材料：増配・減配・金利",
    multiplier: 0.55
  },
  {
    id: "smallai",
    name: "謎の小型AI株",
    description: "期待リターン：未知数 / 値動き：狂気 / 材料：Reddit・提携匂わせ・増資",
    multiplier: 1.85
  }
];

const newsList = [
  { title: "AIバブル崩壊か？", text: "半導体株に利益確定売り。SNSでは『終わりの始まり』がトレンド入り。", change: -8 },
  { title: "決算は良好、でも市場予想には届かず", text: "売上は過去最高。しかし投資家の期待が高すぎて株価は下落。", change: -6 },
  { title: "CEOがAIを27回連呼", text: "決算説明会でAI、AI、AI。市場は素直に好感。", change: 9 },
  { title: "FRB高官、利下げに慎重姿勢", text: "金利低下を期待していたグロース株に売りが広がる。", change: -5 },
  { title: "粗利率が市場予想を上回る", text: "地味ながら強い決算。分かる人には分かるやつ。", change: 7 },
  { title: "有名インフルエンサーが『これはバブル』と投稿", text: "タイムラインが急に不安になる。握力が試される局面。", change: -7 },
  { title: "大型受注を発表", text: "データセンター向け需要が想定以上。市場はポジティブに反応。", change: 11 },
  { title: "ガイダンスが微妙", text: "会社は長期成長を強調。しかし短期勢は容赦なく売る。", change: -10 },
  { title: "謎の小型株がRedditで話題に", text: "よく分からないが急騰。雰囲気は完全に祭り。", change: 15 },
  { title: "アナリストが目標株価を引き上げ", text: "理由は『AI需要のさらなる拡大』。それ昨日も聞いた。", change: 6 },
  { title: "決算ミス", text: "CEOは『長期的には問題ない』と説明。なお株価は許していない。", change: -14 },
  { title: "市場全体がリスクオン", text: "金利低下、ハイテク上昇。昨日までの悲観はどこへ。", change: 8 },
  { title: "謎の格下げ", text: "理由はよく分からないが、雰囲気で売られる。", change: -4 },
  { title: "大型顧客との提携報道", text: "正式発表ではないが、期待だけで株価が走る。", change: 10 },
  { title: "市場は様子見", text: "大きな材料なし。こういう日こそ何もしない力が問われる。", change: 1 },
  { title: "CPIが予想より高い", text: "金利上昇を警戒してグロース株が売られる。", change: -9 },
  { title: "CPIが予想より低い", text: "利下げ期待が復活。なぜか全部買われる。", change: 9 },
  { title: "寄り天、発生", text: "プレマーケットでは爆上げ。本場が始まった瞬間、全部なかったことに。", change: -8 },
  { title: "掲示板が総悲観", text: "ホルダーの心が折れかけている。なお、こういう時が底だったりする。", change: 5 },
  { title: "掲示板が総楽観", text: "全員が勝利を確信。だいたいこういう時が一番こわい。", change: -7 },
  { title: "増資発表", text: "夢を燃料に株数が増える。会社は生き延び、株主は薄まる。", change: -13 },
  { title: "大型契約を発表、ただし金額非公開", text: "すごそうではある。すごそうではあるが、数字はない。", change: 4 },
  { title: "S&P500採用期待が浮上", text: "まだ決まっていないが、期待だけで株価が走り始める。", change: 8 },
  { title: "データセンター関連として急に物色", text: "昨日まで誰も見ていなかったのに、今日からAI銘柄ということになった。", change: 12 },
  { title: "買った瞬間に下がる", text: "あなたの注文を市場が見ていた可能性があります。", change: -6 },
  { title: "売った瞬間に上がる", text: "相場あるある。たぶん誰もが一度は通る道。", change: 7 },
  { title: "決算延期", text: "察し。市場は察しが良い。", change: -12 },
  { title: "長期では強いらしい", text: "短期で弱いときによく聞く言葉。信じるかはあなた次第。", change: -3 },
  { title: "新製品発表", text: "詳細はよく分からないが、プレゼン資料がかっこいい。", change: 5 },
  { title: "市場に謎の楽観ムード", text: "悪材料が出尽くしたということになった。", change: 7 },
  { title: "プレで爆上げ、本場で全戻し", text: "夢を見た時間は短かった。", change: -9 },
  { title: "AI向け電力需要が追い風", text: "関係ありそうな企業がまとめて買われる。", change: 10 },
  { title: "CEOが株主に感謝", text: "株価は感謝だけでは上がらない。", change: -2 }
];

let selectedStock = stockTypes[0];
let selectedAmount = 100000;

let turn = 1;
let cash = 300000;
let stockValue = 700000;
let totalAsset = INITIAL_ASSET;
let peakAsset = INITIAL_ASSET;
let maxDrawdown = 0;
let holdCount = 0;
let tradeCount = 0;
let buyCount = 0;
let sellCount = 0;
let allInCount = 0;
let history = [INITIAL_ASSET];
let currentNews = null;
let currentChange = 0;

const titleArea = document.getElementById("titleArea");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("sellBtn").addEventListener("click", () => chooseAction("sell"));
document.getElementById("holdBtn").addEventListener("click", () => chooseAction("hold"));
document.getElementById("buyBtn").addEventListener("click", () => chooseAction("buy"));
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("copyBtn").addEventListener("click", copyResult);

renderStockChoices();
setupAmountButtons();

function renderStockChoices() {
  const container = document.getElementById("stockChoices");
  container.innerHTML = "";

  stockTypes.forEach(stock => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stock-card";

    if (stock.id === selectedStock.id) {
      button.classList.add("selected");
    }

    button.innerHTML = `
      <strong>${stock.name}</strong>
      <span>${stock.description}</span>
    `;

    button.addEventListener("click", () => {
      selectedStock = stock;
      renderStockChoices();
    });

    container.appendChild(button);
  });
}

function setupAmountButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".amount-btn");
    if (!button) return;

    document.querySelectorAll(".amount-btn").forEach(btn => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    const value = button.dataset.amount;
    selectedAmount = value === "all" ? "all" : Number(value);

    updateSelectedAmountText();
    updateActionLabels();

    if (!gameScreen.classList.contains("hidden")) {
      document.getElementById("message").textContent =
        `売買額を「${getSelectedAmountLabel()}」に変更しました。`;
    }
  });
}

function startGame() {
  resetGameValues();

  titleArea.classList.add("hidden");
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  document.getElementById("selectedStockName").textContent = selectedStock.name;

  showNextNews();
  updateDisplay();
}

function showNextNews() {
  currentNews = newsList[Math.floor(Math.random() * newsList.length)];
  currentChange = Math.round(currentNews.change * selectedStock.multiplier);
  currentChange = Math.max(-35, Math.min(35, currentChange));

  document.getElementById("newsTitle").textContent = currentNews.title;
  document.getElementById("newsText").textContent = currentNews.text;

  const priceChange = document.getElementById("priceChange");
  priceChange.textContent = `${currentChange > 0 ? "+" : ""}${currentChange}%`;
  priceChange.className = "price-change";
  priceChange.classList.add(currentChange >= 0 ? "up" : "down");

  document.getElementById("message").textContent = "";
}

function chooseAction(action) {
  applyMarketChange();

  if (action === "sell") {
    sellStock();
  }

  if (action === "buy") {
    buyStock();
  }

  if (action === "hold") {
    holdCount++;
    document.getElementById("message").textContent = "握った。ニュースに流されない力。";
  }

  totalAsset = cash + stockValue;
  history.push(totalAsset);
  updateDrawdown();

  if (turn >= MAX_TURN) {
    showResult();
    return;
  }

  turn++;
  showNextNews();
  updateDisplay();
}

function applyMarketChange() {
  stockValue = Math.round(stockValue * (1 + currentChange / 100));
}

function sellStock() {
  if (stockValue <= 0) {
    document.getElementById("message").textContent = "もう売る株がありません。";
    return;
  }

  const beforeStockValue = stockValue;
  const sellAmount = getTradeAmount("sell");

  stockValue -= sellAmount;
  cash += sellAmount;
  tradeCount++;
  sellCount++;

  if (sellAmount === beforeStockValue) {
    allInCount++;
  }

  document.getElementById("message").textContent =
    `${formatYen(sellAmount)}分売却。安心感は増えたが、夢は少し減った。`;
}

function buyStock() {
  if (cash <= 0) {
    document.getElementById("message").textContent = "買う現金がありません。";
    return;
  }

  const beforeCash = cash;
  const buyAmount = getTradeAmount("buy");

  cash -= buyAmount;
  stockValue += buyAmount;
  tradeCount++;
  buyCount++;

  if (buyAmount === beforeCash) {
    allInCount++;
  }

  document.getElementById("message").textContent =
    `${formatYen(buyAmount)}分購入。これが押し目か、落ちるナイフか。`;
}

function getTradeAmount(type) {
  const base = type === "buy" ? cash : stockValue;

  if (selectedAmount === "all") {
    return Math.max(0, Math.round(base));
  }

  return Math.max(0, Math.min(Math.round(base), selectedAmount));
}

function updateDrawdown() {
  if (totalAsset > peakAsset) {
    peakAsset = totalAsset;
  }

  const drawdown = (totalAsset - peakAsset) / peakAsset;

  if (drawdown < maxDrawdown) {
    maxDrawdown = drawdown;
  }
}

function updateDisplay() {
  totalAsset = cash + stockValue;

  document.getElementById("turn").textContent = turn;
  document.getElementById("totalAsset").textContent = formatYen(totalAsset);
  document.getElementById("cash").textContent = formatYen(cash);
  document.getElementById("stockValue").textContent = formatYen(stockValue);
  document.getElementById("drawdown").textContent = `最大下落率：${Math.round(maxDrawdown * 100)}%`;

  updateSelectedAmountText();
  updateAssetBars();
  updateActionLabels();
}

function updateAssetBars() {
  const total = cash + stockValue || 1;

  const cashPercent = Math.round((cash / total) * 100);
  const stockPercent = 100 - cashPercent;

  const cashBar = document.getElementById("cashBar");
  const stockBar = document.getElementById("stockBar");
  const pfText = document.getElementById("pfText");

  if (cashBar) cashBar.style.width = `${cashPercent}%`;
  if (stockBar) stockBar.style.width = `${stockPercent}%`;

  if (pfText) {
    pfText.textContent = `PF：株式${stockPercent}% / 現金${cashPercent}%`;
  }
}

function updateSelectedAmountText() {
  const text = document.getElementById("selectedAmountText");
  if (!text) return;

  text.textContent = `選択中：${getSelectedAmountLabel()}`;
}

function updateActionLabels() {
  const sellAmount = getTradeAmount("sell");
  const buyAmount = getTradeAmount("buy");

  document.getElementById("sellBtn").textContent =
    stockValue > 0 ? `売る\n${formatYen(sellAmount)}` : "売る";

  document.getElementById("buyBtn").textContent =
    cash > 0 ? `買う\n${formatYen(buyAmount)}` : "買う";
}

function getSelectedAmountLabel() {
  if (selectedAmount === "all") {
    return "全力";
  }

  return formatYen(selectedAmount);
}

function showResult() {
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  const finalReturn = ((totalAsset - INITIAL_ASSET) / INITIAL_ASSET) * 100;
  const drawdownPercent = Math.round(maxDrawdown * 100);
  const gripScore = calculateGripScore(finalReturn, drawdownPercent);
  const type = getInvestorType(finalReturn, drawdownPercent, gripScore);

  document.getElementById("resultTitle").textContent = type.title;
  document.getElementById("finalAsset").textContent = formatYen(totalAsset);
  document.getElementById("finalReturn").textContent = `${finalReturn >= 0 ? "+" : ""}${finalReturn.toFixed(1)}%`;
  document.getElementById("maxDrawdown").textContent = `${drawdownPercent}%`;
  document.getElementById("gripScore").textContent = `${gripScore}点`;
  document.getElementById("resultComment").textContent = type.comment;
  document.getElementById("resultStockName").textContent = selectedStock.name;

  drawResultChart();

  const shareText =
`投資握力ゲームをやった結果、
私は「${type.title}」でした。

銘柄：${selectedStock.name}
最終資産：${formatYen(totalAsset)}
リターン：${finalReturn >= 0 ? "+" : ""}${finalReturn.toFixed(1)}%
最大下落率：${drawdownPercent}%
握力スコア：${gripScore}点

#投資握力ゲーム`;

  document.getElementById("shareText").value = shareText;
}

function drawResultChart() {
  const canvas = document.getElementById("resultChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const padding = 24;
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  const points = history.map((value, index) => {
    const x = padding + (index / Math.max(history.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  ctx.beginPath();
  ctx.moveTo(points[0].x, height - padding);
  points.forEach(point => ctx.lineTo(point.x, point.y));
  ctx.lineTo(points[points.length - 1].x, height - padding);
  ctx.closePath();
  ctx.fillStyle = "rgba(39,196,107,0.16)";
  ctx.fill();

  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.strokeStyle = "#27c46b";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.stroke();

  const last = points[points.length - 1];
  ctx.fillStyle = "#f5f5f5";
  ctx.strokeStyle = "#27c46b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function calculateGripScore(finalReturn, drawdownPercent) {
  let score = 50;
  score += holdCount * 3.5;
  score += finalReturn * 0.55;
  score += drawdownPercent * 0.25;
  score -= tradeCount * 1.5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getInvestorType(finalReturn, drawdownPercent, gripScore) {
  if (selectedStock.id === "smallai" && finalReturn > 40) {
    return {
      title: "テンバガー夢追い人",
      comment: "謎の小型AI株を握り切りました。勝てば天才、負ければ勉強代です。"
    };
  }

  if (selectedStock.id === "space" && drawdownPercent <= -35 && gripScore >= 60) {
    return {
      title: "宇宙まで握った人",
      comment: "株価は地球に落ちかけましたが、あなたの握力だけは成層圏を突破しました。"
    };
  }

  if (allInCount >= 3) {
    return {
      title: "全力ボタン中毒者",
      comment: "全力の誘惑に負けすぎです。資産形成というよりスポーツに近いです。"
    };
  }

  if (gripScore >= 85 && finalReturn > 20) {
    return {
      title: "握力ゴリラ投資家",
      comment: "暴落も煽りニュースも握り潰しました。もはや株ではなく信念を保有しています。"
    };
  }

  if (buyCount >= 6 && finalReturn < 0) {
    return {
      title: "ナンピン地獄民",
      comment: "下がるたびに買いました。勇気なのか、現実逃避なのかは市場だけが知っています。"
    };
  }

  if (tradeCount >= 12) {
    return {
      title: "売買しすぎ職人",
      comment: "相場より自分の指が忙しいタイプです。手数料無料の時代でよかった。"
    };
  }

  if (finalReturn < -20) {
    return {
      title: "一生含み損マン",
      comment: "まだ負けたわけではありません。売っていなければ、たぶん、きっと。"
    };
  }

  if (drawdownPercent <= -30 && gripScore >= 65) {
    return {
      title: "地獄を見た長期投資家",
      comment: "かなりの下落を見ましたが、最後まで市場に残りました。それだけで偉い。"
    };
  }

  if (finalReturn > 18 && buyCount >= 3) {
    return {
      title: "押し目買いの鬼",
      comment: "下落を恐れず拾えました。なお実戦でできるかは別問題です。"
    };
  }

  if (cash > stockValue) {
    return {
      title: "現金比率おじさん",
      comment: "守りは固いです。ただ、相場が強いときは少し置いていかれがちです。"
    };
  }

  if (gripScore < 35) {
    return {
      title: "狼狽売り職人",
      comment: "ニュースに素直すぎます。SNSを閉じるだけでリターンが改善するかもしれません。"
    };
  }

  return {
    title: "雰囲気投資家",
    comment: "なんとなく売って、なんとなく買って、なんとなく生き残りました。相場は雰囲気。"
  };
}

function copyResult() {
  const textarea = document.getElementById("shareText");
  textarea.select();
  document.execCommand("copy");

  document.getElementById("copyBtn").textContent = "コピーしました";

  setTimeout(() => {
    document.getElementById("copyBtn").textContent = "結果をコピー";
  }, 1600);
}

function restartGame() {
  titleArea.classList.remove("hidden");
  resultScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  resetGameValues();
  resetAmountButtons();
  renderStockChoices();
}

function resetAmountButtons() {
  selectedAmount = 100000;

  document.querySelectorAll(".amount-btn").forEach(button => {
    button.classList.remove("selected");

    if (button.dataset.amount === "100000") {
      button.classList.add("selected");
    }
  });

  updateSelectedAmountText();
}

function resetGameValues() {
  turn = 1;
  cash = 300000;
  stockValue = 700000;
  totalAsset = INITIAL_ASSET;
  peakAsset = INITIAL_ASSET;
  maxDrawdown = 0;
  holdCount = 0;
  tradeCount = 0;
  buyCount = 0;
  sellCount = 0;
  allInCount = 0;
  history = [INITIAL_ASSET];
  currentNews = null;
  currentChange = 0;
}

function formatYen(value) {
  return `${Math.round(value).toLocaleString()}円`;
}
