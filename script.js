const INITIAL_ASSET = 1000000;
const MAX_TURN = 15;

const newsList = [
  {
    title: "AIバブル崩壊か？",
    text: "半導体株に利益確定売り。SNSでは『終わりの始まり』がトレンド入り。",
    change: -8
  },
  {
    title: "決算は良好、でも市場予想には届かず",
    text: "売上は過去最高。しかし投資家の期待が高すぎて株価は下落。",
    change: -6
  },
  {
    title: "CEOがAIを27回連呼",
    text: "決算説明会でAI、AI、AI。市場は素直に好感。",
    change: 9
  },
  {
    title: "FRB高官、利下げに慎重姿勢",
    text: "金利低下を期待していたグロース株に売りが広がる。",
    change: -5
  },
  {
    title: "粗利率が市場予想を上回る",
    text: "地味ながら強い決算。分かる人には分かるやつ。",
    change: 7
  },
  {
    title: "有名インフルエンサーが『これはバブル』と投稿",
    text: "タイムラインが急に不安になる。握力が試される局面。",
    change: -7
  },
  {
    title: "大型受注を発表",
    text: "データセンター向け需要が想定以上。市場はポジティブに反応。",
    change: 11
  },
  {
    title: "ガイダンスが微妙",
    text: "会社は長期成長を強調。しかし短期勢は容赦なく売る。",
    change: -10
  },
  {
    title: "謎の小型株がRedditで話題に",
    text: "よく分からないが急騰。雰囲気は完全に祭り。",
    change: 15
  },
  {
    title: "アナリストが目標株価を引き上げ",
    text: "理由は『AI需要のさらなる拡大』。それ昨日も聞いた。",
    change: 6
  },
  {
    title: "決算ミス",
    text: "CEOは『長期的には問題ない』と説明。なお株価は許していない。",
    change: -14
  },
  {
    title: "市場全体がリスクオン",
    text: "金利低下、ハイテク上昇。昨日までの悲観はどこへ。",
    change: 8
  },
  {
    title: "謎の格下げ",
    text: "理由はよく分からないが、雰囲気で売られる。",
    change: -4
  },
  {
    title: "大型顧客との提携報道",
    text: "正式発表ではないが、期待だけで株価が走る。",
    change: 10
  },
  {
    title: "市場は様子見",
    text: "大きな材料なし。こういう日こそ何もしない力が問われる。",
    change: 1
  },
  {
    title: "CPIが予想より高い",
    text: "金利上昇を警戒してグロース株が売られる。",
    change: -9
  },
  {
    title: "CPIが予想より低い",
    text: "利下げ期待が復活。なぜか全部買われる。",
    change: 9
  },
  {
    title: "株価急落、でも業績は悪くない",
    text: "決算資料を読んだ人だけが少し落ち着いている。",
    change: -6
  },
  {
    title: "新製品発表",
    text: "詳細はよく分からないが、プレゼン資料がかっこいい。",
    change: 5
  },
  {
    title: "市場に謎の楽観ムード",
    text: "悪材料が出尽くしたということになった。",
    change: 7
  }
];

let turn = 1;
let cash = 300000;
let stockValue = 700000;
let totalAsset = INITIAL_ASSET;
let peakAsset = INITIAL_ASSET;
let maxDrawdown = 0;
let holdCount = 0;
let tradeCount = 0;
let history = [INITIAL_ASSET];
let currentNews = null;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("sellBtn").addEventListener("click", () => chooseAction("sell"));
document.getElementById("holdBtn").addEventListener("click", () => chooseAction("hold"));
document.getElementById("buyBtn").addEventListener("click", () => chooseAction("buy"));
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("copyBtn").addEventListener("click", copyResult);

function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  showNextNews();
  updateDisplay();
}

function showNextNews() {
  currentNews = newsList[Math.floor(Math.random() * newsList.length)];

  document.getElementById("newsTitle").textContent = currentNews.title;
  document.getElementById("newsText").textContent = currentNews.text;

  const priceChange = document.getElementById("priceChange");
  priceChange.textContent = `${currentNews.change > 0 ? "+" : ""}${currentNews.change}%`;
  priceChange.className = "price-change";
  priceChange.classList.add(currentNews.change >= 0 ? "up" : "down");

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
    document.getElementById("message").textContent = "握った。えらい。";
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
  stockValue = Math.round(stockValue * (1 + currentNews.change / 100));
}

function sellStock() {
  if (stockValue <= 0) {
    document.getElementById("message").textContent = "もう売る株がありません。";
    return;
  }

  const sellAmount = Math.round(stockValue * 0.5);
  stockValue -= sellAmount;
  cash += sellAmount;
  tradeCount++;
  document.getElementById("message").textContent = "半分売った。安心感は増えたが、夢は少し減った。";
}

function buyStock() {
  if (cash <= 0) {
    document.getElementById("message").textContent = "買い増す現金がありません。";
    return;
  }

  const buyAmount = Math.round(cash * 0.5);
  cash -= buyAmount;
  stockValue += buyAmount;
  tradeCount++;
  document.getElementById("message").textContent = "余力の半分を投入。これが押し目か、落ちるナイフか。";
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

  drawChart();
}

function drawChart() {
  const chart = document.getElementById("chart");
  chart.innerHTML = "";

  const max = Math.max(...history);
  const min = Math.min(...history);

  history.forEach(value => {
    const bar = document.createElement("div");
    bar.className = "bar";

    const range = max - min || 1;
    const height = 20 + ((value - min) / range) * 70;
    bar.style.height = `${height}px`;

    chart.appendChild(bar);
  });
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

  const shareText =
`投資握力ゲームをやった結果、
私は「${type.title}」でした。

最終資産：${formatYen(totalAsset)}
リターン：${finalReturn >= 0 ? "+" : ""}${finalReturn.toFixed(1)}%
最大下落率：${drawdownPercent}%
握力スコア：${gripScore}点

#投資握力ゲーム`;

  document.getElementById("shareText").value = shareText;
}

function calculateGripScore(finalReturn, drawdownPercent) {
  let score = 50;
  score += holdCount * 4;
  score += finalReturn * 0.6;
  score += drawdownPercent * 0.3;
  score -= tradeCount * 3;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function getInvestorType(finalReturn, drawdownPercent, gripScore) {
  if (gripScore >= 85 && finalReturn > 20) {
    return {
      title: "握力ゴリラ投資家",
      comment: "暴落も煽りニュースも握り潰しました。もはや株ではなく信念を保有しています。"
    };
  }

  if (tradeCount >= 9) {
    return {
      title: "売買しすぎ職人",
      comment: "相場より自分の指が忙しいタイプです。手数料無料の時代でよかった。"
    };
  }

  if (finalReturn < -15) {
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

  if (finalReturn > 15) {
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
  turn = 1;
  cash = 300000;
  stockValue = 700000;
  totalAsset = INITIAL_ASSET;
  peakAsset = INITIAL_ASSET;
  maxDrawdown = 0;
  holdCount = 0;
  tradeCount = 0;
  history = [INITIAL_ASSET];
  currentNews = null;

  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function formatYen(value) {
  return `${Math.round(value).toLocaleString()}円`;
}
