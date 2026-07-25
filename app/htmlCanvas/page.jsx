"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit3,
  FiType,
  FiSquare,
  FiCircle,
  FiArrowUpRight,
  FiDownload,
  FiCopy,
  FiTrash2,
  FiRotateCcw,
  FiRotateCw,
  FiMaximize,
  FiMinimize,
  FiGrid,
  FiSun,
  FiMoon,
  FiZoomIn,
  FiZoomOut,
  FiUpload,
  FiX,
  FiImage,
  FiHelpCircle,
  FiMinus,
  FiBold,
  FiItalic,
  FiSend,
  FiCheck,
} from "react-icons/fi";
import { TbBrush, TbEraser } from "react-icons/tb";
import { BsPaintBucket } from "react-icons/bs";
import { PiHighlighterBold } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";

const CANVAS_W = 1600;
const CANVAS_H = 1000;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 4;

const COLOR_SWATCHES = [
  "#f8fafc",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#0f172a",
];

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16
  );
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function colorsMatch(a, b, tolerance = 24) {
  return (
    Math.abs(a[0] - b[0]) <= tolerance &&
    Math.abs(a[1] - b[1]) <= tolerance &&
    Math.abs(a[2] - b[2]) <= tolerance &&
    Math.abs(a[3] - b[3]) <= tolerance
  );
}

let uidCounter = 0;
function uid() {
  uidCounter += 1;
  return `id-${Date.now()}-${uidCounter}`;
}

export default function CanvasWorkspace() {
  // ---------- Core refs ----------
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const shapeSnapshotRef = useRef(null);
  const shapeStartRef = useRef({ x: 0, y: 0 });
  const isSpaceDownRef = useRef(false);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const dragStateRef = useRef(null); // { id, type, offsetX, offsetY }
  const resizeStateRef = useRef(null); // { id, startW, startH, startX, startY }

  // ---------- Tool / brush state ----------
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#f8fafc");
  const [brushSize, setBrushSize] = useState(6);
  const [opacity, setOpacity] = useState(1);
  const [hardness, setHardness] = useState(100);

  // ---------- Canvas objects ----------
  const [images, setImages] = useState([]); // {id, src, x, y, width, height}
  const [texts, setTexts] = useState([]); // {id, x, y, text, fontSize, color, bold, italic}
  const [selectedId, setSelectedId] = useState(null);

  // ---------- History ----------
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // ---------- Canvas chrome ----------
  const [background, setBackground] = useState("dark"); // dark | white | transparent | gradient
  const [gridMode, setGridMode] = useState("off"); // off | light | dark
  const [uiTheme, setUiTheme] = useState("dark"); // dark | light
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ---------- UI overlays ----------
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedFlash, setCopiedFlash] = useState(false);

  // =========================================================
  // Setup canvas
  // =========================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // seed initial history
    const snap = {
      dataURL: canvas.toDataURL(),
      images: [],
      texts: [],
    };
    setHistory([snap]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // History helpers
  // =========================================================
  const pushHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setImages((currentImages) => {
      setTexts((currentTexts) => {
        setHistory((h) => {
          const truncated = h.slice(0, historyIndexRef.current + 1);
          const snap = {
            dataURL,
            images: currentImages.map((i) => ({ ...i })),
            texts: currentTexts.map((t) => ({ ...t })),
          };
          const nextHist = [...truncated, snap];
          historyIndexRef.current = nextHist.length - 1;
          setHistoryIndex(nextHist.length - 1);
          return nextHist;
        });
        return currentTexts;
      });
      return currentImages;
    });
  }, []);

  const historyIndexRef = useRef(-1);
  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  const restoreSnapshot = useCallback((snap) => {
    if (!snap) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = snap.dataURL;
    setImages(snap.images.map((i) => ({ ...i })));
    setTexts(snap.texts.map((t) => ({ ...t })));
  }, []);

  const undo = useCallback(() => {
    setHistoryIndex((idx) => {
      if (idx <= 0) return idx;
      const newIdx = idx - 1;
      restoreSnapshot(history[newIdx]);
      return newIdx;
    });
  }, [history, restoreSnapshot]);

  const redo = useCallback(() => {
    setHistoryIndex((idx) => {
      if (idx >= history.length - 1) return idx;
      const newIdx = idx + 1;
      restoreSnapshot(history[newIdx]);
      return newIdx;
    });
  }, [history, restoreSnapshot]);

  // =========================================================
  // Coordinate helpers
  // =========================================================
  const getCanvasPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  }, []);

  // =========================================================
  // Flood fill
  // =========================================================
  const floodFillAt = useCallback(
    (x, y, hex) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const { width, height } = canvas;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const px = Math.floor(clamp(x, 0, width - 1));
      const py = Math.floor(clamp(y, 0, height - 1));
      const startIdx = (py * width + px) * 4;
      const startColor = [
        data[startIdx],
        data[startIdx + 1],
        data[startIdx + 2],
        data[startIdx + 3],
      ];
      const { r, g, b } = hexToRgb(hex);
      const fillColor = [r, g, b, Math.round(opacity * 255)];
      if (colorsMatch(startColor, fillColor, 4)) return;

      const stack = [[px, py]];
      const visited = new Uint8Array(width * height);
      while (stack.length) {
        const [cx, cy] = stack.pop();
        if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
        const vIdx = cy * width + cx;
        if (visited[vIdx]) continue;
        const idx = vIdx * 4;
        if (
          !colorsMatch(
            [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]],
            startColor
          )
        )
          continue;
        visited[vIdx] = 1;
        data[idx] = fillColor[0];
        data[idx + 1] = fillColor[1];
        data[idx + 2] = fillColor[2];
        data[idx + 3] = fillColor[3];
        stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
      }
      ctx.putImageData(imageData, 0, 0);
    },
    [opacity]
  );

  // =========================================================
  // Drawing handlers
  // =========================================================
  const applyStrokeStyle = useCallback(
    (ctx) => {
      ctx.globalCompositeOperation =
        tool === "eraser" ? "destination-out" : "source-over";
      ctx.strokeStyle = color;
      ctx.globalAlpha = tool === "highlighter" ? opacity * 0.45 : opacity;
      ctx.lineWidth =
        tool === "highlighter" ? brushSize * 2.2 : brushSize;
      ctx.shadowBlur =
        tool === "brush" || tool === "highlighter"
          ? ((100 - hardness) / 100) * brushSize
          : 0;
      ctx.shadowColor = color;
    },
    [tool, color, opacity, brushSize, hardness]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (isSpaceDownRef.current) {
        isPanningRef.current = true;
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          panX: pan.x,
          panY: pan.y,
        };
        return;
      }
      if (dragStateRef.current || resizeStateRef.current) return;

      const pos = getCanvasPos(e);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (tool === "text") {
        const newText = {
          id: uid(),
          x: pos.x,
          y: pos.y,
          text: "Type here",
          fontSize: 32,
          color,
          bold: false,
          italic: false,
        };
        setTexts((t) => [...t, newText]);
        setSelectedId(`text-${newText.id}`);
        setTimeout(() => pushHistory(), 0);
        return;
      }

      if (tool === "fill") {
        floodFillAt(pos.x, pos.y, color);
        pushHistory();
        return;
      }

      setSelectedId(null);

      if (["line", "rect", "circle", "arrow"].includes(tool)) {
        shapeStartRef.current = pos;
        shapeSnapshotRef.current = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        isDrawingRef.current = true;
        return;
      }

      // freehand tools
      isDrawingRef.current = true;
      lastPosRef.current = pos;
      applyStrokeStyle(ctx);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    },
    [tool, color, pan, getCanvasPos, floodFillAt, pushHistory, applyStrokeStyle]
  );

  const drawShapePreview = useCallback(
    (start, current) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.putImageData(shapeSnapshotRef.current, 0, 0);
      applyStrokeStyle(ctx);
      ctx.globalCompositeOperation = "source-over";
      ctx.beginPath();

      if (tool === "line" || tool === "arrow") {
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(current.x, current.y);
        ctx.stroke();
        if (tool === "arrow") {
          const angle = Math.atan2(current.y - start.y, current.x - start.x);
          const headLen = clamp(brushSize * 3, 14, 40);
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(
            current.x - headLen * Math.cos(angle - Math.PI / 6),
            current.y - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(
            current.x - headLen * Math.cos(angle + Math.PI / 6),
            current.y - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      } else if (tool === "rect") {
        ctx.strokeRect(
          start.x,
          start.y,
          current.x - start.x,
          current.y - start.y
        );
      } else if (tool === "circle") {
        const rx = Math.abs(current.x - start.x) / 2;
        const ry = Math.abs(current.y - start.y) / 2;
        const cx = (current.x + start.x) / 2;
        const cy = (current.y + start.y) / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    [tool, brushSize, applyStrokeStyle]
  );

  const handlePointerMove = useCallback(
    (e) => {
      const pos = getCanvasPos(e);
      setMousePos({ x: Math.round(pos.x), y: Math.round(pos.y) });

      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        setPan({
          x: panStartRef.current.panX + dx,
          y: panStartRef.current.panY + dy,
        });
        return;
      }

      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (["line", "rect", "circle", "arrow"].includes(tool)) {
        drawShapePreview(shapeStartRef.current, pos);
        return;
      }

      // freehand
      applyStrokeStyle(ctx);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPosRef.current = pos;
    },
    [tool, getCanvasPos, drawShapePreview, applyStrokeStyle]
  );

  const handlePointerUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      const ctx = canvasRef.current.getContext("2d");
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      shapeSnapshotRef.current = null;
      pushHistory();
    }
  }, [pushHistory]);

  // =========================================================
  // Image upload
  // =========================================================
  const addImageFromFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      const imgEl = new window.Image();
      imgEl.onload = () => {
        const maxW = 420;
        const ratio = imgEl.width / imgEl.height;
        const width = imgEl.width > maxW ? maxW : imgEl.width;
        const height = width / ratio;
        const newImg = {
          id: uid(),
          src,
          x: 120,
          y: 120,
          width,
          height,
        };
        setImages((imgs) => [...imgs, newImg]);
        setSelectedId(`img-${newImg.id}`);
        setTimeout(() => pushHistory(), 0);
      };
      imgEl.src = src;
    };
    reader.readAsDataURL(file);
  }, [pushHistory]);

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) addImageFromFile(file);
    e.target.value = "";
  };

  // =========================================================
  // Drag / resize for images & text overlays
  // =========================================================
  const startDrag = (e, id, type) => {
    e.stopPropagation();
    setSelectedId(`${type}-${id}`);
    if (tool === "text" && type === "text") return; // allow click-to-edit without drag lock
    const list = type === "img" ? images : texts;
    const item = list.find((i) => i.id === id);
    dragStateRef.current = {
      id,
      type,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: item.x,
      startY: item.y,
    };
  };

  const startResize = (e, id) => {
    e.stopPropagation();
    const item = images.find((i) => i.id === id);
    resizeStateRef.current = {
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startW: item.width,
      startH: item.height,
    };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (dragStateRef.current) {
        const { id, type, startClientX, startClientY, startX, startY } =
          dragStateRef.current;
        const dx = (e.clientX - startClientX) / zoom;
        const dy = (e.clientY - startClientY) / zoom;
        if (type === "img") {
          setImages((imgs) =>
            imgs.map((i) =>
              i.id === id ? { ...i, x: startX + dx, y: startY + dy } : i
            )
          );
        } else {
          setTexts((txts) =>
            txts.map((t) =>
              t.id === id ? { ...t, x: startX + dx, y: startY + dy } : t
            )
          );
        }
      }
      if (resizeStateRef.current) {
        const { id, startClientX, startClientY, startW, startH } =
          resizeStateRef.current;
        const dx = (e.clientX - startClientX) / zoom;
        const dy = (e.clientY - startClientY) / zoom;
        setImages((imgs) =>
          imgs.map((i) =>
            i.id === id
              ? {
                  ...i,
                  width: clamp(startW + dx, 40, 2000),
                  height: clamp(startH + dy, 40, 2000),
                }
              : i
          )
        );
      }
    };
    const onUp = () => {
      if (dragStateRef.current || resizeStateRef.current) {
        dragStateRef.current = null;
        resizeStateRef.current = null;
        pushHistory();
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [zoom, pushHistory]);

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    if (selectedId.startsWith("img-")) {
      const id = selectedId.replace("img-", "");
      setImages((imgs) => imgs.filter((i) => i.id !== id));
    } else if (selectedId.startsWith("text-")) {
      const id = selectedId.replace("text-", "");
      setTexts((txts) => txts.filter((t) => t.id !== id));
    }
    setSelectedId(null);
    setTimeout(() => pushHistory(), 0);
  }, [selectedId, pushHistory]);

  // =========================================================
  // Zoom / Pan / Fullscreen
  // =========================================================
  useEffect(() => {
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom((z) => clamp(Number((z + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // =========================================================
  // Export / Download / Clipboard / AI Analyze
  // =========================================================
  const buildCompositeCanvas = useCallback(() => {
    const temp = document.createElement("canvas");
    temp.width = CANVAS_W;
    temp.height = CANVAS_H;
    const ctx = temp.getContext("2d");

    if (background === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, temp.width, temp.height);
    } else if (background === "dark") {
      ctx.fillStyle = "#0b0b12";
      ctx.fillRect(0, 0, temp.width, temp.height);
    } else if (background === "gradient") {
      const g = ctx.createLinearGradient(0, 0, temp.width, temp.height);
      g.addColorStop(0, "#1e1b4b");
      g.addColorStop(1, "#0f172a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, temp.width, temp.height);
    }
    // transparent -> leave blank

    ctx.drawImage(canvasRef.current, 0, 0);

    // draw images synchronously is tricky (async load) — use cached elements
    images.forEach((imgObj) => {
      const el = new window.Image();
      el.src = imgObj.src;
      // best effort synchronous draw if already cached by browser
      try {
        ctx.drawImage(el, imgObj.x, imgObj.y, imgObj.width, imgObj.height);
      } catch (err) {
        /* ignore if not yet decoded */
      }
    });

    texts.forEach((t) => {
      ctx.fillStyle = t.color;
      const style = `${t.italic ? "italic" : ""} ${
        t.bold ? "bold" : ""
      } ${t.fontSize}px 'Inter', sans-serif`;
      ctx.font = style.trim();
      ctx.textBaseline = "top";
      ctx.fillText(t.text, t.x, t.y);
    });

    return temp;
  }, [images, texts, background]);

  const downloadFile = (format) => {
    const temp = buildCompositeCanvas();
    const mime = format === "jpg" ? "image/jpeg" : "image/png";
    const url = temp.toDataURL(mime, 0.95);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canvas-workspace.${format === "jpg" ? "jpg" : "png"}`;
    a.click();
    setShowDownloadMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      const temp = buildCompositeCanvas();
      temp.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new window.ClipboardItem({ "image/png": blob }),
        ]);
        setCopiedFlash(true);
        setTimeout(() => setCopiedFlash(false), 1500);
      });
    } catch (err) {
      alert("Clipboard copy is not supported in this browser.");
    }
    setShowDownloadMenu(false);
  };

  const exportBase64 = () => {
    const temp = buildCompositeCanvas();
    const dataURL = temp.toDataURL("image/png");
    navigator.clipboard?.writeText(dataURL).catch(() => {});
    alert("Base64 string copied to clipboard (also logged to console).");
    // eslint-disable-next-line no-console
    console.log(dataURL);
    setShowDownloadMenu(false);
  };

  const analyzeWithAI = () => {
    setIsAnalyzing(true);
    const temp = buildCompositeCanvas();
    const dataURL = temp.toDataURL("image/png");
    setTimeout(() => {
      setAiPreview(dataURL);
      setIsAnalyzing(false);
      // NOTE: no backend call implemented — dataURL is ready to be sent
      // to your AI endpoint from here, e.g. onAnalyze?.(dataURL)
    }, 700);
  };

  // =========================================================
  // Clear canvas
  // =========================================================
  const performClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setImages([]);
    setTexts([]);
    setSelectedId(null);
    setShowClearConfirm(false);
    setTimeout(() => pushHistory(), 0);
  };

  // =========================================================
  // Keyboard shortcuts
  // =========================================================
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space" && !isSpaceDownRef.current) {
        isSpaceDownRef.current = true;
      }
      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      if (ctrlOrCmd && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (ctrlOrCmd && e.key.toLowerCase() === "y") ||
        (ctrlOrCmd && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        e.preventDefault();
        redo();
      } else if (ctrlOrCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        downloadFile("png");
      } else if (ctrlOrCmd && e.key.toLowerCase() === "c" && selectedId) {
        // let native copy work for text fields; else copy canvas
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && document.activeElement?.tagName !== "DIV") {
          deleteSelected();
        }
      }
    };
    const onKeyUp = (e) => {
      if (e.code === "Space") isSpaceDownRef.current = false;
    };
    const onPaste = (e) => {
      const item = Array.from(e.clipboardData?.items || []).find((i) =>
        i.type.startsWith("image")
      );
      if (item) {
        const file = item.getAsFile();
        if (file) addImageFromFile(file);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("paste", onPaste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undo, redo, selectedId, deleteSelected, addImageFromFile]);

  // =========================================================
  // Derived helpers
  // =========================================================
  const selectedText = selectedId?.startsWith("text-")
    ? texts.find((t) => `text-${t.id}` === selectedId)
    : null;

  const updateSelectedText = (patch) => {
    if (!selectedText) return;
    setTexts((txts) =>
      txts.map((t) => (t.id === selectedText.id ? { ...t, ...patch } : t))
    );
  };

  const gridBg =
    gridMode === "off"
      ? "none"
      : gridMode === "light"
      ? "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)"
      : "linear-gradient(rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.18) 1px, transparent 1px)";

  const canvasBackgroundStyle =
    background === "white"
      ? "#ffffff"
      : background === "dark"
      ? "#0b0b12"
      : background === "gradient"
      ? "linear-gradient(135deg,#1e1b4b,#0f172a)"
      : "repeating-conic-gradient(#1e1e2a 0% 25%, #15151d 0% 50%) 50% / 20px 20px";

  const drawTools = [
    { id: "pencil", icon: FiEdit3, label: "Pencil" },
    { id: "brush", icon: TbBrush, label: "Brush" },
    { id: "highlighter", icon: PiHighlighterBold, label: "Highlighter" },
    { id: "eraser", icon: TbEraser, label: "Eraser" },
  ];
  const shapeTools = [
    { id: "line", icon: FiMinus, label: "Line" },
    { id: "rect", icon: FiSquare, label: "Rectangle" },
    { id: "circle", icon: FiCircle, label: "Circle" },
    { id: "arrow", icon: FiArrowUpRight, label: "Arrow" },
  ];
  const otherTools = [
    { id: "text", icon: FiType, label: "Text" },
    { id: "fill", icon: BsPaintBucket, label: "Fill" },
  ];

  const isDrawTool = ["pencil", "brush", "highlighter", "eraser"].includes(
    tool
  );

  // =========================================================
  // Small reusable-in-render pieces (not separate components)
  // =========================================================
  const ToolButton = ({ id, icon: Icon, label }) => (
    <motion.button
      key={id}
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        setTool(id);
        setSelectedId(null);
      }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      className={`relative flex h-10 w-10 items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 ${
        tool === id
          ? "bg-gradient-to-br from-violet-500/90 to-fuchsia-500/80 text-white shadow-[0_0_20px_rgba(168,85,247,0.55)]"
          : "text-white/60 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      {tool === id && (
        <motion.span
          layoutId="tool-glow"
          className="absolute inset-0 rounded-2xl ring-1 ring-white/30"
        />
      )}
    </motion.button>
  );

  return (
    <div
      ref={containerRef}
      className={`relative flex h-screen w-full flex-col overflow-hidden ${
        uiTheme === "dark" ? "bg-[#07070c]" : "bg-slate-100"
      } text-white`}
      style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
    >
      {/* Animated mesh background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-600/25 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-[130px]"
        />
      </div>

      {/* ===================== TOP TOOLBAR ===================== */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="pointer-events-auto absolute left-1/2 top-4 z-30 -translate-x-1/2"
      >
        <div className="flex flex-wrap items-center gap-1 rounded-3xl border border-white/10 bg-white/5 px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          {drawTools.map((t) => (
            <ToolButton key={t.id} {...t} />
          ))}
          <div className="mx-1 h-6 w-px bg-white/10" />
          {shapeTools.map((t) => (
            <ToolButton key={t.id} {...t} />
          ))}
          <div className="mx-1 h-6 w-px bg-white/10" />
          {otherTools.map((t) => (
            <ToolButton key={t.id} {...t} />
          ))}
          <div className="mx-1 h-6 w-px bg-white/10" />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            disabled={historyIndex <= 0}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-25"
          >
            <FiRotateCcw size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            disabled={historyIndex >= history.length - 1}
            onClick={redo}
            title="Redo (Ctrl+Y)"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-25"
          >
            <FiRotateCw size={18} />
          </motion.button>

          <div className="mx-1 h-6 w-px bg-white/10" />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => fileInputRef.current?.click()}
            title="Upload image"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <FiImage size={18} />
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowClearConfirm(true)}
            title="Clear canvas"
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white/60 transition hover:bg-rose-500/20 hover:text-rose-300"
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* ===================== BRUSH SETTINGS PANEL ===================== */}
      <AnimatePresence>
        {(isDrawTool || tool === "fill") && (
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="absolute left-4 top-1/2 z-30 w-60 -translate-y-1/2 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
              Brush Settings
            </p>

            <div className="mb-4 flex items-center justify-center">
              <div
                className="rounded-full border border-white/10"
                style={{
                  width: 56,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                <div
                  style={{
                    width: clamp(brushSize, 2, 48),
                    height: clamp(brushSize, 2, 48),
                    borderRadius: "9999px",
                    background: color,
                    opacity,
                    filter: `blur(${(100 - hardness) / 40}px)`,
                  }}
                />
              </div>
            </div>

            <label className="mb-1 block text-[11px] text-white/50">
              Size — {brushSize}px
            </label>
            <input
              type="range"
              min={1}
              max={80}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="mb-4 w-full accent-violet-500"
            />

            <label className="mb-1 block text-[11px] text-white/50">
              Opacity — {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min={0.05}
              max={1}
              step={0.01}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="mb-4 w-full accent-violet-500"
            />

            <label className="mb-1 block text-[11px] text-white/50">
              Hardness — {hardness}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={hardness}
              onChange={(e) => setHardness(Number(e.target.value))}
              className="mb-4 w-full accent-violet-500"
            />

            <label className="mb-2 block text-[11px] text-white/50">
              Color
            </label>
            <div className="mb-2 grid grid-cols-5 gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    color === c
                      ? "border-white scale-110"
                      : "border-white/10"
                  }`}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== TEXT STYLE PANEL ===================== */}
      <AnimatePresence>
        {selectedText && (
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="absolute right-4 top-1/2 z-30 w-60 -translate-y-1/2 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
              Text Style
            </p>
            <label className="mb-1 block text-[11px] text-white/50">
              Font Size — {selectedText.fontSize}px
            </label>
            <input
              type="range"
              min={10}
              max={140}
              value={selectedText.fontSize}
              onChange={(e) =>
                updateSelectedText({ fontSize: Number(e.target.value) })
              }
              className="mb-4 w-full accent-fuchsia-500"
            />
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => updateSelectedText({ bold: !selectedText.bold })}
                className={`flex h-9 flex-1 items-center justify-center rounded-xl border border-white/10 transition ${
                  selectedText.bold
                    ? "bg-fuchsia-500/80 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
              >
                <FiBold size={16} />
              </button>
              <button
                onClick={() =>
                  updateSelectedText({ italic: !selectedText.italic })
                }
                className={`flex h-9 flex-1 items-center justify-center rounded-xl border border-white/10 transition ${
                  selectedText.italic
                    ? "bg-fuchsia-500/80 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
              >
                <FiItalic size={16} />
              </button>
            </div>
            <label className="mb-2 block text-[11px] text-white/50">
              Color
            </label>
            <input
              type="color"
              value={selectedText.color}
              onChange={(e) => updateSelectedText({ color: e.target.value })}
              className="mb-2 h-9 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
            />
            <button
              onClick={deleteSelected}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20"
            >
              <FiTrash2 size={14} /> Delete text
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== TOP-RIGHT UTILITY CLUSTER ===================== */}
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() =>
            setGridMode((g) =>
              g === "off" ? "light" : g === "light" ? "dark" : "off"
            )
          }
          title="Toggle grid"
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 backdrop-blur-2xl transition ${
            gridMode !== "off"
              ? "bg-violet-500/30 text-white"
              : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          <FiGrid size={17} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setUiTheme((t) => (t === "dark" ? "light" : "dark"))}
          title="Toggle UI theme"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-2xl transition hover:text-white"
        >
          {uiTheme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleFullscreen}
          title="Fullscreen"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-2xl transition hover:text-white"
        >
          {isFullscreen ? <FiMinimize size={17} /> : <FiMaximize size={17} />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowShortcuts(true)}
          title="Keyboard shortcuts"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 backdrop-blur-2xl transition hover:text-white"
        >
          <FiHelpCircle size={17} />
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDownloadMenu((s) => !s)}
            title="Export"
            className="flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white/70 backdrop-blur-2xl transition hover:text-white"
          >
            <FiDownload size={16} /> Export
          </motion.button>
          <AnimatePresence>
            {showDownloadMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d16]/95 p-1.5 shadow-2xl backdrop-blur-2xl"
              >
                <button
                  onClick={() => downloadFile("png")}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <FiDownload size={14} /> Download PNG
                </button>
                <button
                  onClick={() => downloadFile("jpg")}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <FiDownload size={14} /> Download JPG
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <FiCopy size={14} />
                  {copiedFlash ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button
                  onClick={exportBase64}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <FiCopy size={14} /> Export Base64
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168,85,247,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={analyzeWithAI}
          disabled={isAnalyzing}
          className="flex h-10 items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-semibold text-white shadow-lg transition"
        >
          <HiSparkles size={16} className={isAnalyzing ? "animate-spin" : ""} />
          {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
        </motion.button>
      </div>

      {/* ===================== BACKGROUND SELECTOR ===================== */}
      <div className="absolute left-4 bottom-16 z-30 flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-2xl">
        {[
          { id: "dark", label: "Dark", swatch: "#0b0b12" },
          { id: "white", label: "White", swatch: "#ffffff" },
          { id: "transparent", label: "Transparent", swatch: "checker" },
          { id: "gradient", label: "Gradient", swatch: "linear-gradient(135deg,#1e1b4b,#0f172a)" },
        ].map((b) => (
          <motion.button
            key={b.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={b.label}
            onClick={() => setBackground(b.id)}
            className={`h-7 w-7 rounded-full border-2 transition ${
              background === b.id ? "border-violet-400" : "border-white/20"
            }`}
            style={{
              background:
                b.swatch === "checker"
                  ? "repeating-conic-gradient(#333 0% 25%, #555 0% 50%) 50% / 10px 10px"
                  : b.swatch,
            }}
          />
        ))}
      </div>

      {/* ===================== ZOOM CONTROLS ===================== */}
      <div className="absolute right-4 bottom-16 z-30 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-2xl">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoom((z) => clamp(z - 0.1, MIN_ZOOM, MAX_ZOOM))}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
        >
          <FiZoomOut size={16} />
        </motion.button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="px-2 text-xs font-medium text-white/60 hover:text-white"
        >
          {Math.round(zoom * 100)}%
        </button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setZoom((z) => clamp(z + 0.1, MIN_ZOOM, MAX_ZOOM))}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white"
        >
          <FiZoomIn size={16} />
        </motion.button>
      </div>

      {/* ===================== CANVAS STAGE ===================== */}
      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden"
        style={{
          cursor: isSpaceDownRef.current ? "grab" : "default",
        }}
        onMouseDown={() => {
          if (!isSpaceDownRef.current) setSelectedId(null);
        }}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            position: "relative",
          }}
          className="rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <div
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              background: canvasBackgroundStyle,
              backgroundSize: "20px 20px",
              position: "relative",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: gridBg,
                backgroundSize: "32px 32px",
                pointerEvents: "none",
              }}
            />
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Drawing canvas"
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                position: "absolute",
                inset: 0,
                touchAction: "none",
                cursor:
                  tool === "text"
                    ? "text"
                    : tool === "fill"
                    ? "cell"
                    : "crosshair",
              }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
            />

            {/* Image overlays */}
            {images.map((img) => (
              <div
                key={img.id}
                onMouseDown={(e) => startDrag(e, img.id, "img")}
                style={{
                  position: "absolute",
                  left: img.x,
                  top: img.y,
                  width: img.width,
                  height: img.height,
                  cursor: "move",
                  outline:
                    selectedId === `img-${img.id}`
                      ? "2px solid #a855f7"
                      : "none",
                  borderRadius: 8,
                }}
              >
                <img
                  src={img.src}
                  alt="uploaded"
                  draggable={false}
                  className="h-full w-full select-none rounded-lg object-fill"
                />
                {selectedId === `img-${img.id}` && (
                  <>
                    <div
                      onMouseDown={(e) => startResize(e, img.id)}
                      style={{
                        position: "absolute",
                        right: -8,
                        bottom: -8,
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: "#a855f7",
                        border: "2px solid white",
                        cursor: "nwse-resize",
                      }}
                    />
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSelected();
                      }}
                      style={{
                        position: "absolute",
                        top: -14,
                        right: -14,
                        width: 26,
                        height: 26,
                      }}
                      className="flex items-center justify-center rounded-full bg-rose-500 text-white shadow-lg"
                    >
                      <FiX size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}

            {/* Text overlays */}
            {texts.map((t) => (
              <div
                key={t.id}
                onMouseDown={(e) => startDrag(e, t.id, "text")}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(`text-${t.id}`);
                }}
                suppressContentEditableWarning
                contentEditable
                onBlur={(e) => {
                  setTexts((txts) =>
                    txts.map((tx) =>
                      tx.id === t.id
                        ? { ...tx, text: e.target.innerText || " " }
                        : tx
                    )
                  );
                  pushHistory();
                }}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  fontSize: t.fontSize,
                  color: t.color,
                  fontWeight: t.bold ? 700 : 400,
                  fontStyle: t.italic ? "italic" : "normal",
                  cursor: "text",
                  minWidth: 20,
                  outline:
                    selectedId === `text-${t.id}`
                      ? "2px dashed rgba(168,85,247,0.7)"
                      : "none",
                  padding: 2,
                  whiteSpace: "pre",
                }}
              >
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================== STATUS BAR ===================== */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2">
        <div className="pointer-events-auto flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-2 text-[11px] text-white/50 backdrop-blur-2xl">
          <span>
            Canvas <span className="text-white/80">{CANVAS_W}×{CANVAS_H}</span>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>
            Cursor{" "}
            <span className="text-white/80">
              {mousePos.x}, {mousePos.y}
            </span>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>
            Zoom <span className="text-white/80">{Math.round(zoom * 100)}%</span>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>
            Tool{" "}
            <span className="capitalize text-white/80">{tool}</span>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span>
            Brush <span className="text-white/80">{brushSize}px</span>
          </span>
          <span className="h-3 w-px bg-white/15" />
          <span className="flex items-center gap-1.5">
            Color
            <span
              className="inline-block h-3 w-3 rounded-full border border-white/30"
              style={{ background: color }}
            />
          </span>
        </div>
      </div>

      {/* ===================== AI PREVIEW CARD ===================== */}
      <AnimatePresence>
        {aiPreview && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute bottom-20 right-4 z-40 w-72 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/50">
                <HiSparkles className="text-fuchsia-400" /> AI Preview
              </p>
              <button
                onClick={() => setAiPreview(null)}
                className="text-white/40 hover:text-white"
              >
                <FiX size={14} />
              </button>
            </div>
            <img
              src={aiPreview}
              alt="AI preview"
              className="mb-3 w-full rounded-2xl border border-white/10"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                // dataURL in `aiPreview` is ready to send to your backend/AI here
                alert("Ready to send this image to your AI endpoint.");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2 text-sm font-semibold text-white"
            >
              <FiSend size={14} /> Send to AI
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== CLEAR CONFIRM MODAL ===================== */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-80 rounded-3xl border border-white/10 bg-[#0d0d16]/95 p-6 shadow-2xl"
            >
              <p className="mb-2 text-lg font-semibold">Clear canvas?</p>
              <p className="mb-5 text-sm text-white/50">
                This will remove every stroke, shape, image, and text layer.
                This action cannot be undone once confirmed.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-xl px-4 py-2 text-sm text-white/60 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={performClear}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                >
                  <FiTrash2 size={14} /> Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== SHORTCUTS MODAL ===================== */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-96 rounded-3xl border border-white/10 bg-[#0d0d16]/95 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold">Keyboard Shortcuts</p>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-white/40 hover:text-white"
                >
                  <FiX size={18} />
                </button>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {[
                  ["Ctrl / Cmd + Z", "Undo"],
                  ["Ctrl / Cmd + Y", "Redo"],
                  ["Delete / Backspace", "Delete selected"],
                  ["Space + Drag", "Pan canvas"],
                  ["Mouse Wheel", "Zoom in / out"],
                  ["Ctrl / Cmd + S", "Download PNG"],
                  ["Ctrl / Cmd + V", "Paste image"],
                ].map(([key, action]) => (
                  <li
                    key={key}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                  >
                    <span className="text-white/50">{action}</span>
                    <kbd className="rounded-lg border border-white/15 bg-black/30 px-2 py-1 font-mono text-xs">
                      {key}
                    </kbd>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}