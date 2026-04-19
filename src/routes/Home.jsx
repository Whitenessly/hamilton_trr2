import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, RotateCcw,
  MousePointer2, PlusCircle, GitMerge, Trash2,
  MapPin, Trash, Cpu, ChevronRight,
  ZoomIn, ZoomOut, Maximize, Zap, List,
  Eye, EyeOff, Terminal, ChevronDown, ChevronUp, Map as MapIcon, X, GripHorizontal, Menu,
  Sun, Moon, Settings2, Gamepad2, RefreshCw, Dices, Loader2, StopCircle
} from 'lucide-react';

const STORAGE_KEY = 'hamiltonian_map_save_v11';
const THEME_KEY = 'hamiltonian_theme_mode';

const MAP_LEVELS = [
  { id: 1, name: "Ngôi nhà nhỏ", nodes: [{ id: 'n1', x: 300, y: 150, label: '1' }, { id: 'n2', x: 200, y: 250, label: '2' }, { id: 'n3', x: 400, y: 250, label: '3' }, { id: 'n4', x: 200, y: 400, label: '4' }, { id: 'n5', x: 400, y: 400, label: '5' }], edges: [{ id: 'e1', source: 'n1', target: 'n2' }, { id: 'e2', source: 'n1', target: 'n3' }, { id: 'e3', source: 'n2', target: 'n3' }, { id: 'e4', source: 'n2', target: 'n4' }, { id: 'e5', source: 'n3', target: 'n5' }, { id: 'e6', source: 'n4', target: 'n5' }] },
  { id: 2, name: "Viên kim cương", nodes: [{ id: 'n1', x: 300, y: 150, label: '1' }, { id: 'n2', x: 200, y: 250, label: '2' }, { id: 'n3', x: 400, y: 250, label: '3' }, { id: 'n4', x: 300, y: 350, label: '4' }], edges: [{ source: 'n1', target: 'n2', id: 'e1' }, { source: 'n1', target: 'n3', id: 'e2' }, { source: 'n2', target: 'n4', id: 'e3' }, { source: 'n3', target: 'n4', id: 'e4' }, { source: 'n2', target: 'n3', id: 'e5' }] },
  { id: 3, name: "Con bướm", nodes: [{ id: 'n1', x: 200, y: 150, label: '1' }, { id: 'n2', x: 200, y: 350, label: '2' }, { id: 'n3', x: 300, y: 250, label: '3' }, { id: 'n4', x: 400, y: 150, label: '4' }, { id: 'n5', x: 400, y: 350, label: '5' }], edges: [{ source: 'n1', target: 'n2', id: 'e1' }, { source: 'n1', target: 'n3', id: 'e2' }, { source: 'n2', target: 'n3', id: 'e3' }, { source: 'n3', target: 'n4', id: 'e4' }, { source: 'n3', target: 'n5', id: 'e5' }, { source: 'n4', target: 'n5', id: 'e6' }] },
  { id: 4, name: "Lục giác chéo", nodes: [{ id: 'n1', x: 300, y: 100, label: '1' }, { id: 'n2', x: 430, y: 175, label: '2' }, { id: 'n3', x: 430, y: 325, label: '3' }, { id: 'n4', x: 300, y: 400, label: '4' }, { id: 'n5', x: 170, y: 325, label: '5' }, { id: 'n6', x: 170, y: 175, label: '6' }], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n1',id:'e6'},{source:'n1',target:'n4',id:'e7'},{source:'n2',target:'n5',id:'e8'},{source:'n3',target:'n6',id:'e9'}] },
  { id: 5, name: "Bánh xe", nodes: [{ id: 'n1', x: 300, y: 250, label: '1' }, { id: 'n2', x: 300, y: 100, label: '2' }, { id: 'n3', x: 440, y: 150, label: '3' }, { id: 'n4', x: 380, y: 350, label: '4' }, { id: 'n5', x: 220, y: 350, label: '5' }, { id: 'n6', x: 160, y: 150, label: '6' }], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n1',target:'n3',id:'e2'},{source:'n1',target:'n4',id:'e3'},{source:'n1',target:'n5',id:'e4'},{source:'n1',target:'n6',id:'e5'},{source:'n2',target:'n3',id:'e6'},{source:'n3',target:'n4',id:'e7'},{source:'n4',target:'n5',id:'e8'},{source:'n5',target:'n6',id:'e9'},{source:'n6',target:'n2',id:'e10'}] },
  { id: 6, name: "Khối lập phương", nodes: [{ id: 'n1', x: 200, y: 200, label: '1' }, { id: 'n2', x: 300, y: 200, label: '2' }, { id: 'n3', x: 300, y: 300, label: '3' }, { id: 'n4', x: 200, y: 300, label: '4' }, { id: 'n5', x: 250, y: 150, label: '5' }, { id: 'n6', x: 350, y: 150, label: '6' }, { id: 'n7', x: 350, y: 250, label: '7' }, { id: 'n8', x: 250, y: 250, label: '8' }], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n1',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n7',id:'e6'},{source:'n7',target:'n8',id:'e7'},{source:'n8',target:'n5',id:'e8'},{source:'n1',target:'n5',id:'e9'},{source:'n2',target:'n6',id:'e10'},{source:'n3',target:'n7',id:'e11'},{source:'n4',target:'n8',id:'e12'}] },
  { id: 7, name: "Bát giác chéo", nodes: [{id: 'n1', x: 300, y: 100, label: '1'}, {id: 'n2', x: 440, y: 160, label: '2'}, {id: 'n3', x: 500, y: 300, label: '3'}, {id: 'n4', x: 440, y: 440, label: '4'}, {id: 'n5', x: 300, y: 500, label: '5'}, {id: 'n6', x: 160, y: 440, label: '6'}, {id: 'n7', x: 100, y: 300, label: '7'}, {id: 'n8', x: 160, y: 160, label: '8'}], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n7',id:'e6'},{source:'n7',target:'n8',id:'e7'},{source:'n8',target:'n1',id:'e8'},{source:'n1',target:'n5',id:'e9'},{source:'n2',target:'n6',id:'e10'},{source:'n3',target:'n7',id:'e11'},{source:'n4',target:'n8',id:'e12'}] },
  { id: 8, name: "Đồ thị Petersen", nodes: [{ id: 'n1', x: 300, y: 100, label: '1' }, { id: 'n2', x: 490, y: 240, label: '2' }, { id: 'n3', x: 420, y: 450, label: '3' }, { id: 'n4', x: 180, y: 450, label: '4' }, { id: 'n5', x: 110, y: 240, label: '5' }, { id: 'n6', x: 300, y: 200, label: '6' }, { id: 'n7', x: 395, y: 270, label: '7' }, { id: 'n8', x: 360, y: 375, label: '8' }, { id: 'n9', x: 240, y: 375, label: '9' }, { id: 'n10', x: 205, y: 270, label: '10' }], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n1',id:'e5'},{source:'n6',target:'n8',id:'e6'},{source:'n8',target:'n10',id:'e7'},{source:'n10',target:'n7',id:'e8'},{source:'n7',target:'n9',id:'e9'},{source:'n9',target:'n6',id:'e10'},{source:'n1',target:'n6',id:'e11'},{source:'n2',target:'n7',id:'e12'},{source:'n3',target:'n8',id:'e13'},{source:'n4',target:'n9',id:'e14'},{source:'n5',target:'n10',id:'e15'}] },
  { id: 9, name: "Lưới 3x4", nodes: [{ id: 'n1', x: 150, y: 150, label: '1' }, { id: 'n2', x: 250, y: 150, label: '2' }, { id: 'n3', x: 350, y: 150, label: '3' }, { id: 'n4', x: 450, y: 150, label: '4' }, { id: 'n5', x: 150, y: 250, label: '5' }, { id: 'n6', x: 250, y: 250, label: '6' }, { id: 'n7', x: 350, y: 250, label: '7' }, { id: 'n8', x: 450, y: 250, label: '8' }, { id: 'n9', x: 150, y: 350, label: '9' }, { id: 'n10', x: 250, y: 350, label: '10' }, { id: 'n11', x: 350, y: 350, label: '11' }, { id: 'n12', x: 450, y: 350, label: '12' }], edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n5',target:'n6',id:'e4'},{source:'n6',target:'n7',id:'e5'},{source:'n7',target:'n8',id:'e6'},{source:'n9',target:'n10',id:'e7'},{source:'n10',target:'n11',id:'e8'},{source:'n11',target:'n12',id:'e9'},{source:'n1',target:'n5',id:'e10'},{source:'n5',target:'n9',id:'e11'},{source:'n2',target:'n6',id:'e12'},{source:'n6',target:'n10',id:'e13'},{source:'n3',target:'n7',id:'e14'},{source:'n7',target:'n11',id:'e15'},{source:'n4',target:'n8',id:'e16'},{source:'n8',target:'n12',id:'e17'}] }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showMobileLeft, setShowMobileLeft] = useState(false);
  const [showMobileRight, setShowMobileRight] = useState(false);
  const isDark = theme === 'dark';

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); };

  const [currentLevel, setCurrentLevel] = useState(0); 
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [nextEdgeId, setNextEdgeId] = useState(1);
  const [startNode, setStartNode] = useState(null);
  const [past, setPast] = useState([]);

  const [mode, setMode] = useState('select');
  const [interaction, setInteraction] = useState({ type: 'none' });
  const [isClick, setIsClick] = useState(true);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [pendingEdgeSource, setPendingEdgeSource] = useState(null);
  const [gamePath, setGamePath] = useState([]);
  const didStartNewPath = useRef(false);

  // Random Modal
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randMinNodes, setRandMinNodes] = useState(3);
  const [randMaxNodes, setRandMaxNodes] = useState(6);
  const [randEdgePercent, setRandEdgePercent] = useState(30);

  // Layout Widths
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250); 
  const [rightPanelWidth, setRightPanelWidth] = useState(384); 
  const [logHeight, setLogHeight] = useState(200);

  // --- HỆ THỐNG LOG CACHE IN-MEMORY ---
  const allLogsRef = useRef([]); 
  const [autoScrollLog, setAutoScrollLog] = useState(true);
  const [logScrollTop, setLogScrollTop] = useState(0); // Cho cuộn ảo Log

  // --- CACHE IN-MEMORY CHO TÌM SIÊU TỐC ---
  const fastSearchCacheRef = useRef({}); // Lưu đa luồng (nhiều cache cho nhiều Hash map)
  const allFastResultsRef = useRef([]);
  const fastGridRef = useRef(null);
  const [fastGridScroll, setFastGridScroll] = useState(0);
  const [forceRender, setForceRender] = useState(0);
  const [gridCols, setGridCols] = useState(1);

  const [currentStepData, setCurrentStepData] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [searchAllNodes, setSearchAllNodes] = useState(false);
  
  const [showFastResultsModal, setShowFastResultsModal] = useState(false);
  const [isSearchingFast, setIsSearchingFast] = useState(false);
  const [fastSearchMetrics, setFastSearchMetrics] = useState({ iters: 0, paths: 0 });
  
  const [showLogs, setShowLogs] = useState(true);
  const [showResultsHistory, setShowResultsHistory] = useState(true);
  const [foundPaths, setFoundPaths] = useState([]);
  const [viewingStaticPath, setViewingStaticPath] = useState(null);

  const svgRef = useRef(null);
  const logContainerRef = useRef(null);
  const pinchDistanceRef = useRef(null);
  const isPinching = useRef(false);

  const stepGenRef = useRef(null);
  const activeSearchIdRef = useRef(0);

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1280) setGridCols(4);
      else if (window.innerWidth >= 1024) setGridCols(3);
      else if (window.innerWidth >= 768) setGridCols(2);
      else setGridCols(1);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) setTheme(savedTheme);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
    else setTheme('light');
  }, []);

  useEffect(() => {
    const wrapper = document.getElementById('hamilton-app-wrapper');
    const syncTheme = () => {
      const elementsToUpdate = new Set([document.documentElement, document.body]);
      let current = wrapper?.parentElement;
      while (current) { elementsToUpdate.add(current); current = current.parentElement; }
      elementsToUpdate.forEach(el => {
        if (el && el.classList) {
          if (isDark) el.classList.add('dark'); else el.classList.remove('dark');
        }
      });
    };
    syncTheme();
    const observer = new MutationObserver(() => syncTheme());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    if (wrapper?.parentElement) observer.observe(wrapper.parentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [isDark]);

  const toggleTheme = () => { const newTheme = isDark ? 'light' : 'dark'; setTheme(newTheme); localStorage.setItem(THEME_KEY, newTheme); };

  useEffect(() => {
    setPendingEdgeSource(null);
    if (mode !== 'play') setGamePath([]);
  }, [mode]);

  const pushHistory = (skipCustom = false) => {
    setPast(prev => [...prev, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)), startNode, nextNodeId, nextEdgeId }]);
    if (!skipCustom) setCurrentLevel('custom');
  };

  const handleUndo = () => {
    setPast(prevPast => {
      if (prevPast.length === 0) return prevPast;
      const previousState = prevPast[prevPast.length - 1];
      setNodes(previousState.nodes); setEdges(previousState.edges); setStartNode(previousState.startNode); setNextNodeId(previousState.nextNodeId); setNextEdgeId(previousState.nextEdgeId);
      setCurrentLevel('custom'); return prevPast.slice(0, -1);
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNodes(data.nodes || []); setEdges(data.edges || []); setStartNode(data.startNode || null);
        setNextNodeId(Math.max(0, ...(data.nodes || []).map(n => parseInt(n.id.replace(/\D/g, '')) || 0)) + 1);
        setNextEdgeId(Math.max(0, ...(data.edges || []).map(e => parseInt(e.id.replace(/\D/g, '')) || 0)) + 1);
        setCurrentLevel(data.currentLevel !== undefined ? data.currentLevel : 'custom');
      } catch (e) { loadLevel(MAP_LEVELS[0], 0); }
    } else { loadLevel(MAP_LEVELS[0], 0); }
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || currentLevel === 'custom' || currentLevel === 'random') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, startNode, currentLevel }));
    }
  }, [nodes, edges, startNode, currentLevel]);

  useEffect(() => {
    if (interaction.type !== 'resizingLog' && interaction.type !== 'resizingLeft' && interaction.type !== 'resizingRight') return;
    const handlePointerMove = (e) => {
      if (interaction.type === 'resizingLog') {
        setLogHeight(Math.max(60, Math.min(window.innerHeight - e.clientY, window.innerHeight * 0.8)));
      } else if (window.innerWidth >= 768) {
        if (interaction.type === 'resizingLeft') {
          const newWidth = Math.max(64, Math.min(e.clientX, window.innerWidth * 0.4));
          setLeftPanelWidth(newWidth); setIsSidebarExpanded(newWidth > 100);
        } else if (interaction.type === 'resizingRight') {
          setRightPanelWidth(Math.max(200, Math.min(window.innerWidth - e.clientX, window.innerWidth * 0.5)));
        }
      }
    };
    const handlePointerUp = () => setInteraction({ type: 'none' });
    window.addEventListener('pointermove', handlePointerMove); window.addEventListener('pointerup', handlePointerUp);
    return () => { window.removeEventListener('pointermove', handlePointerMove); window.removeEventListener('pointerup', handlePointerUp); };
  }, [interaction.type]);

  useEffect(() => {
    if (mode === 'play' && nodes.length > 0 && gamePath.length === nodes.length) {
      const pathString = gamePath.join(',');
      if (!foundPaths.some(p => p.path.join(',') === pathString)) {
        const startLabel = nodes.find(n => n.id === gamePath[0])?.label || gamePath[0];
        setFoundPaths(curr => [...curr, { path: [...gamePath], startNodeLabel: startLabel }]);
        setShowResultsHistory(true); 
        showToast('🎉 CHÚC MỪNG BẠN ĐÃ TÌM ĐƯỢC ĐƯỜNG ĐI! 🎉');
      }
    }
  }, [gamePath, mode, nodes, foundPaths]);

  const toggleSidebar = () => { if (isSidebarExpanded) { setLeftPanelWidth(80); setIsSidebarExpanded(false); } else { setLeftPanelWidth(250); setIsSidebarExpanded(true); } };

  const getMapHash = () => {
    return `${nodes.map(n=>n.id).join('')}|${edges.map(e=>[e.source, e.target].sort().join('-')).sort().join('')}|${startNode}|${searchAllNodes}`;
  };

  const resetVisualizer = () => {
    stepGenRef.current = null;
    activeSearchIdRef.current++;
    
    allLogsRef.current = [];
    setCurrentStepData(null);
    setAutoScrollLog(true);
    setLogScrollTop(0);

    setIsPlaying(false);
    setIsSkipping(false);
    setIsSearchingFast(false);
    setViewingStaticPath(null);
    setFoundPaths([]);
    setGamePath([]); 
    allFastResultsRef.current = [];
    setFastGridScroll(0);
    setForceRender(prev => prev + 1);
  };

  const loadLevel = (lvl, index) => {
    pushHistory(true); 
    setNodes(lvl.nodes); setEdges(lvl.edges); setStartNode(null);
    resetVisualizer();
    setNextNodeId(Math.max(0, ...lvl.nodes.map(n => parseInt(n.id.replace(/\D/g, '')) || 0)) + 1);
    setNextEdgeId(Math.max(0, ...lvl.edges.map(e => parseInt(e.id.replace(/\D/g, '')) || 0)) + 1);
    setCurrentLevel(index);
    if (window.innerWidth < 768) setShowMobileLeft(false);
  };

  const resetCurrentMap = () => {
    if (currentLevel === 'custom' || currentLevel === 'random') {
      pushHistory(); setNodes([]); setEdges([]); setStartNode(null); setNextNodeId(1); setNextEdgeId(1);
      resetVisualizer(); showToast("Đã xóa trắng bản đồ!");
    } else {
      loadLevel(MAP_LEVELS[currentLevel], currentLevel); showToast(`Đã reset màn chơi: ${MAP_LEVELS[currentLevel].name}`);
    }
  };

  const handleMinNodesChange = (val) => { let newVal = Math.max(3, Math.min(val, 14)); setRandMinNodes(newVal); if (newVal >= randMaxNodes) setRandMaxNodes(newVal + 1); };
  const handleMaxNodesChange = (val) => { let newVal = Math.max(randMinNodes + 1, Math.min(val, 15)); setRandMaxNodes(newVal); };

  const generateRandomMap = () => {
    const N = Math.floor(Math.random() * (randMaxNodes - randMinNodes + 1)) + randMinNodes;
    const newNodes = []; const centerX = 300; const centerY = 300; const radius = 150 + (N * 5); 

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * 2 * Math.PI; const jitterX = (Math.random() - 0.5) * 40; const jitterY = (Math.random() - 0.5) * 40;
      newNodes.push({ id: `n${i + 1}`, x: centerX + radius * Math.cos(angle) + jitterX, y: centerY + radius * Math.sin(angle) + jitterY, label: `${i + 1}` });
    }

    const newEdges = []; let edgeIdCounter = 1;
    
    // 1. TẠO VÒNG TRÒN (CYCLE) ĐỂ ĐẢM BẢO LIÊN THÔNG VÀ 100% LUÔN CÓ ĐƯỜNG ĐI HAMILTON
    for (let i = 0; i < N; i++) {
      const u = newNodes[i].id;
      const v = newNodes[(i + 1) % N].id;
      newEdges.push({ id: `e${edgeIdCounter++}`, source: u, target: v });
    }

    const maxPossibleEdges = (N * (N - 1)) / 2; const remainingPossibleEdges = maxPossibleEdges - newEdges.length;
    let edgesToAdd = Math.floor(remainingPossibleEdges * (randEdgePercent / 100));
    const possibleEdges = [];

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const u = newNodes[i].id; const v = newNodes[j].id;
        if (!newEdges.some(e => (e.source === u && e.target === v) || (e.source === v && e.target === u))) possibleEdges.push({ u, v });
      }
    }
    for (let i = possibleEdges.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [possibleEdges[i], possibleEdges[j]] = [possibleEdges[j], possibleEdges[i]]; }
    for (let i = 0; i < edgesToAdd && i < possibleEdges.length; i++) { newEdges.push({ id: `e${edgeIdCounter++}`, source: possibleEdges[i].u, target: possibleEdges[i].v }); }

    pushHistory(true); setNodes(newNodes); setEdges(newEdges); setStartNode(null); resetVisualizer();
    setNextNodeId(N + 1); setNextEdgeId(edgeIdCounter); setCurrentLevel('random'); setShowRandomModal(false);
    if (window.innerWidth < 768) setShowMobileLeft(false);
    showToast(`Đã tạo map Random: ${N} đỉnh, ${newEdges.length} cạnh.`);
  };

  const getSvgCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return { x: (clientX - rect.left - transform.x) / transform.scale, y: (clientY - rect.top - transform.y) / transform.scale };
  };

  const createEdgeBetween = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    const exists = edges.some(edge => (edge.source === sourceId && edge.target === targetId) || (edge.target === sourceId && edge.source === targetId));
    if (!exists) { pushHistory(); setEdges([...edges, { id: `e${nextEdgeId}`, source: sourceId, target: targetId }]); setNextEdgeId(prev => prev + 1); }
  };

  const handleGamePathMove = (targetId) => {
    setGamePath(prevPath => {
      if (prevPath.length === 0) return [targetId];
      const lastNode = prevPath[prevPath.length - 1];
      if (lastNode === targetId) return prevPath; 
      if (prevPath.length > 1 && prevPath[prevPath.length - 2] === targetId) return prevPath.slice(0, -1);
      if (!prevPath.includes(targetId)) {
        if (edges.some(edge => (edge.source === lastNode && edge.target === targetId) || (edge.target === lastNode && edge.source === targetId))) {
          return [...prevPath, targetId];
        }
      }
      return prevPath;
    });
  };

  const onSvgPointerDown = (e) => {
    setIsClick(true);
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    setInteraction({ type: 'panning', startX: clientX - transform.x, startY: clientY - transform.y });
  };

  const onNodePointerDown = (e, nodeId) => {
    e.stopPropagation(); setIsClick(true);
    const isAlgorithmActive = isPlaying || stepGenRef.current !== null || viewingStaticPath;

    if (isAlgorithmActive) { setInteraction({ type: 'none' }); return; }

    if (mode === 'addEdge') {
      setInteraction({ type: 'drawingEdge', sourceId: nodeId }); setMouseCoords(getSvgCoords(e));
    } else if (mode === 'remove' || mode === 'setStart') {
    } else if (mode === 'play') {
      setInteraction({ type: 'playingGamePath' });
      if (gamePath.length === 0) { setGamePath([nodeId]); didStartNewPath.current = true; }
      else {
        const lastNode = gamePath[gamePath.length - 1];
        if (lastNode === nodeId) { didStartNewPath.current = false; }
        else if (!gamePath.includes(nodeId)) {
          if (edges.some(edge => (edge.source === lastNode && edge.target === nodeId) || (edge.target === lastNode && edge.source === nodeId))) {
            setGamePath([...gamePath, nodeId]); didStartNewPath.current = true;
          } else { setGamePath([nodeId]); didStartNewPath.current = true; }
        } else { setGamePath([nodeId]); didStartNewPath.current = true; }
      }
    } else { pushHistory(); setInteraction({ type: 'draggingNode', nodeId }); }
  };

  const onEdgePointerDown = (e, edgeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || stepGenRef.current !== null || viewingStaticPath;
    if (isAlgorithmActive || mode === 'play') return;
    if (mode === 'remove') { pushHistory(); setEdges(edges.filter(edge => edge.id !== edgeId)); }
  };

  const onPointerMove = (e) => {
    if (isPinching.current) return;
    setIsClick(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    if (interaction.type === 'playingGamePath') {
      const elem = document.elementFromPoint(clientX, clientY); const targetNode = elem?.closest('[data-nodeid]');
      if (targetNode) { const targetId = targetNode.getAttribute('data-nodeid'); if (targetId) handleGamePathMove(targetId); }
    } else if (interaction.type === 'panning') {
      setTransform(prev => ({ ...prev, x: clientX - interaction.startX, y: clientY - interaction.startY }));
    } else if (interaction.type === 'draggingNode') {
      const coords = getSvgCoords(e); setNodes(nodes.map(n => n.id === interaction.nodeId ? { ...n, x: coords.x, y: coords.y } : n));
    } else if (interaction.type === 'drawingEdge') { setMouseCoords(getSvgCoords(e)); }
  };

  const onSvgPointerUp = (e) => {
    const isAlgorithmActive = isPlaying || stepGenRef.current !== null || viewingStaticPath;
    if (isClick && mode === 'addNode' && !isAlgorithmActive) {
      pushHistory(); const coords = getSvgCoords(e);
      setNodes([...nodes, { id: `n${nextNodeId}`, x: coords.x, y: coords.y, label: `${nextNodeId}` }]); setNextNodeId(prev => prev + 1);
    }
    if (interaction.type === 'drawingEdge') setPendingEdgeSource(null);
    if (interaction.type !== 'resizingLog') setInteraction({ type: 'none' });
  };

  const onNodePointerUp = (e, nodeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || stepGenRef.current !== null || viewingStaticPath;
    if (isAlgorithmActive) { setInteraction({ type: 'none' }); return; }

    if (mode === 'play') {
      if (isClick && gamePath.length > 0) {
        const lastNode = gamePath[gamePath.length - 1];
        if (lastNode === nodeId && !didStartNewPath.current) setGamePath(gamePath.slice(0, -1));
      }
      setInteraction({ type: 'none' }); return;
    }

    if (mode === 'addEdge') {
      if (!isClick && interaction.type === 'drawingEdge') {
        const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
        const clientY = e.clientY ?? (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
        if (clientX && clientY) {
          const elem = document.elementFromPoint(clientX, clientY); const targetNode = elem?.closest('[data-nodeid]');
          if (targetNode) { const targetId = targetNode.getAttribute('data-nodeid'); if (targetId && targetId !== interaction.sourceId) createEdgeBetween(interaction.sourceId, targetId); }
        }
        setPendingEdgeSource(null);
      } else if (isClick) {
        if (pendingEdgeSource && pendingEdgeSource !== nodeId) { createEdgeBetween(pendingEdgeSource, nodeId); setPendingEdgeSource(null); } 
        else if (pendingEdgeSource === nodeId) { setPendingEdgeSource(null); } 
        else { setPendingEdgeSource(nodeId); }
      }
    } else if (isClick) {
      if (mode === 'remove') {
        pushHistory(); setNodes(nodes.filter(n => n.id !== nodeId)); setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        if (startNode === nodeId) setStartNode(null);
      } else if (mode === 'setStart' || mode === 'select') {
        if (startNode !== nodeId) { 
          // Chỉ chọn gốc, không thay đổi level sang custom
          pushHistory(true); 
          setStartNode(nodeId); 
        }
      }
    }
    if (interaction.type !== 'resizingLog') setInteraction({ type: 'none' });
  };

  const handleZoom = (factor) => setTransform(prev => ({ ...prev, scale: Math.min(Math.max(prev.scale * factor, 0.3), 3) }));
  const handleWheel = (e) => {
    const delta = e.deltaY < 0 ? 1.1 : 0.9; let newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect(); const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top;
    setTransform({ x: mouseX - (mouseX - transform.x) * (newScale / transform.scale), y: mouseY - (mouseY - transform.y) * (newScale / transform.scale), scale: newScale });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length >= 2) {
      isPinching.current = true;
      pinchDistanceRef.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length >= 2 && isPinching.current) {
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (pinchDistanceRef.current) {
        const delta = dist / pinchDistanceRef.current; let newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);
        const clientX = (e.touches[0].clientX + e.touches[1].clientX) / 2; const clientY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect(); const mouseX = clientX - rect.left; const mouseY = clientY - rect.top;
          setTransform(prev => ({ x: mouseX - (mouseX - prev.x) * (newScale / prev.scale), y: mouseY - (mouseY - prev.y) * (newScale / prev.scale), scale: newScale }));
        }
      }
      pinchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && interaction.type === 'playingGamePath') {
      const elem = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY); const targetNode = elem?.closest('[data-nodeid]');
      if (targetNode) { const targetId = targetNode.getAttribute('data-nodeid'); if (targetId) handleGamePathMove(targetId); }
    }
  };

  const handleTouchEnd = (e) => { if (e.touches.length < 2) { isPinching.current = false; pinchDistanceRef.current = null; } };

  const getEffectiveStartNodes = () => {
    if (searchAllNodes) return nodes.map(n => n.id);
    if (startNode) return [startNode];
    const defaultNode = nodes.find(n => n.label === '1' || n.id === 'n1') || nodes[0];
    if (defaultNode) return [defaultNode.id];
    return [];
  };
  const getLabel = (id) => nodes.find(n => n.id === id)?.label || id;

  // =========================================================================
  // --- VIRTUAL SCROLLING CHO SYSTEM LOG ---
  // =========================================================================
  const LOG_ITEM_HEIGHT = 28;
  const totalLogs = allLogsRef.current.length;
  const totalLogHeight = totalLogs * LOG_ITEM_HEIGHT;

  const handleLogScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setLogScrollTop(scrollTop);
    if (scrollHeight - scrollTop - clientHeight < 20) {
      setAutoScrollLog(true);
    } else {
      setAutoScrollLog(false);
    }
  };

  // Cuộn xuống đáy tự động
  useEffect(() => {
    if (autoScrollLog && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [forceRender, autoScrollLog]);

  const startLogRow = Math.max(0, Math.floor(logScrollTop / LOG_ITEM_HEIGHT) - 5);
  const visibleLogCount = Math.ceil(logHeight / LOG_ITEM_HEIGHT) + 15;
  const endLogRow = Math.min(totalLogs, startLogRow + visibleLogCount);
  const visibleLogsVirtual = allLogsRef.current.slice(startLogRow, endLogRow);
  const logOffsetY = startLogRow * LOG_ITEM_HEIGHT;

  const renderLogAction = (s) => {
    if (s.type === 'backtrack') {
        const parts = s.action.split(/(\[.*?\])/g);
        return parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
                return <span key={i} className="text-white bg-red-600 dark:bg-red-500 font-black px-1.5 py-0.5 mx-1 rounded text-[11px] shadow-sm">{part}</span>;
            }
            return part;
        });
    }
    return s.action;
  };

  // =========================================================================
  // --- VIRTUAL SCROLLING TÌM SIÊU TỐC ---
  // =========================================================================
  const FAST_ITEM_HEIGHT = 88; // 76px item height + 12px gap
  const totalFastItems = allFastResultsRef.current.length;
  const totalFastRows = Math.ceil(totalFastItems / gridCols);
  const totalFastHeight = totalFastRows * FAST_ITEM_HEIGHT;

  const startFastRow = Math.max(0, Math.floor(fastGridScroll / FAST_ITEM_HEIGHT) - 2);
  // Hiển thị thoải mái số phần tử để không bị chớp khi cuộn
  const visibleFastRowsCount = Math.ceil(window.innerHeight / FAST_ITEM_HEIGHT) + 4;
  const endFastRow = Math.min(totalFastRows, startFastRow + visibleFastRowsCount);
  
  const startFastIndex = startFastRow * gridCols;
  const endFastIndex = Math.min(totalFastItems, endFastRow * gridCols);
  const visibleFastResults = allFastResultsRef.current.slice(startFastIndex, endFastIndex);
  const fastOffsetY = startFastRow * FAST_ITEM_HEIGHT;


  // =========================================================================
  // --- CORE ENGINE 1: ASYNC TIME-SLICED DFS CHO TÌM SIÊU TỐC ---
  // =========================================================================
  const runFastGlobalSearch = () => {
    if (isSearchingFast) {
      setShowFastResultsModal(true);
      return;
    }

    const startNodesToRun = getEffectiveStartNodes();
    if (startNodesToRun.length === 0) { showToast("Không tìm thấy đỉnh hợp lệ để bắt đầu!"); return; }

    const hash = getMapHash();

    // RESTORE TỪ CACHE
    if (fastSearchCacheRef.current[hash] && fastSearchCacheRef.current[hash].results.length > 0) {
        resetVisualizer();
        allFastResultsRef.current = [...fastSearchCacheRef.current[hash].results];
        setFastSearchMetrics({ iters: fastSearchCacheRef.current[hash].iters, paths: fastSearchCacheRef.current[hash].totalPaths });
        setShowFastResultsModal(true);
        setForceRender(prev => prev + 1);
        if (fastGridRef.current) fastGridRef.current.scrollTop = 0;
        return;
    }

    resetVisualizer(); 

    if (nodes.length > 1) {
      if (nodes.some(node => !edges.some(edge => edge.source === node.id || edge.target === node.id))) {
        showToast("Bản đồ có đỉnh bị cô lập, KHÔNG THỂ có đường đi Hamilton!");
        setShowFastResultsModal(true); 
        return;
      }
    }

    activeSearchIdRef.current++;
    const currentSearchId = activeSearchIdRef.current;
    
    setIsSearchingFast(true);
    allFastResultsRef.current = [];
    setFastSearchMetrics({ iters: 0, paths: 0 });
    setShowFastResultsModal(true);
    setForceRender(prev => prev + 1);
    
    if (!showResultsHistory) setShowResultsHistory(true);
    if (window.innerWidth < 768) setShowMobileRight(false);

    setTimeout(async () => {
      const adj = {};
      nodes.forEach(n => adj[n.id] = []);
      edges.forEach(e => { adj[e.source].push(e.target); adj[e.target].push(e.source); });

      let stack = [];
      for (let i = startNodesToRun.length - 1; i >= 0; i--) {
        stack.push({ u: startNodesToRun[i], path: [startNodesToRun[i]], visited: new Set([startNodesToRun[i]]) });
      }

      let pathsFoundBuffer = [];
      let iterations = 0;
      let totalPaths = 0;
      let lastTime = performance.now();

      const searchLoop = async () => {
        while (stack.length > 0) {
          if (activeSearchIdRef.current !== currentSearchId) return;

          let frame = stack.pop();

          if (frame.path.length === nodes.length) {
            totalPaths++;
            pathsFoundBuffer.push({ path: frame.path, startNodeLabel: getLabel(frame.path[0]) });
          } else {
            for (let i = adj[frame.u].length - 1; i >= 0; i--) {
              let v = adj[frame.u][i];
              if (!frame.visited.has(v)) {
                let newVisited = new Set(frame.visited);
                newVisited.add(v);
                stack.push({ u: v, path: [...frame.path, v], visited: newVisited });
              }
            }
          }

          iterations++;
          if (iterations % 2000 === 0) {
            if (performance.now() - lastTime > 40) { 
              if (pathsFoundBuffer.length > 0) {
                allFastResultsRef.current.push(...pathsFoundBuffer);
                pathsFoundBuffer = [];
              }
              setFastSearchMetrics({ iters: iterations, paths: totalPaths });
              setForceRender(prev => prev + 1);
              await new Promise(r => setTimeout(r, 0)); 
              lastTime = performance.now();
            }
          }
        }

        if (pathsFoundBuffer.length > 0) {
          allFastResultsRef.current.push(...pathsFoundBuffer);
        }
        setFastSearchMetrics({ iters: iterations, paths: totalPaths });
        setIsSearchingFast(false);
        setForceRender(prev => prev + 1);

        fastSearchCacheRef.current[getMapHash()] = {
            results: [...allFastResultsRef.current],
            iters: iterations,
            totalPaths
        };
      };

      await searchLoop();
    }, 50);
  };

  const cancelFastSearch = () => {
    activeSearchIdRef.current++; 
    setIsSearchingFast(false);
    showToast("Đã dừng tìm kiếm siêu tốc!");
  };

  // =========================================================================
  // --- CORE ENGINE 2: GENERATOR CHO TIẾN TRÌNH TRỰC QUAN (KHÔNG GIỚI HẠN) ---
  // =========================================================================
  function* createStepGenerator(nodes, edges, startNodes, searchAll) {
    let stepId = 0;
    const addStep = (obj) => ({ id: ++stepId, ...obj });

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => { adj[e.source].push(e.target); adj[e.target].push(e.source); });

    yield addStep({ type: 'start', path: [], current: null, action: `Khởi tạo thuật toán Backtracking...` });

    let foundCount = 0;

    for (let root of startNodes) {
        if (searchAll) yield addStep({ type: 'info', path: [], current: root, action: `=== BẮT ĐẦU TÌM TỪ GỐC [${getLabel(root)}] ===` });

        let stack = [{ u: root, path: [root], visited: new Set([root]), neighbors: adj[root], nIdx: 0, isPushed: false }];

        while(stack.length > 0) {
            let frame = stack[stack.length - 1];

            if (!frame.isPushed) {
                frame.isPushed = true;
                yield addStep({ type: 'visit', path: [...frame.path], current: frame.u, action: `Push: Đưa [${getLabel(frame.u)}] vào Stack.` });

                if (frame.path.length === nodes.length) {
                    foundCount++;
                    yield addStep({ type: 'success', path: [...frame.path], current: frame.u, startNodeLabel: getLabel(root), action: `=> TÌM THẤY ĐƯỜNG HAMILTON #${foundCount}: ${frame.path.map(p=>getLabel(p)).join('→')}` });
                    let poppedPath = frame.path.slice(0, -1);
                    yield addStep({ type: 'backtrack', path: poppedPath, current: frame.path[frame.path.length - 2] || null, backtracked: frame.u, action: `Pop: Rút [${getLabel(frame.u)}] khỏi Stack.` });
                    stack.pop();
                    continue;
                }
            }

            if (frame.nIdx < frame.neighbors.length) {
                let v = frame.neighbors[frame.nIdx];
                frame.nIdx++;

                yield addStep({ type: 'check_edge', path: [...frame.path], current: frame.u, next: v, action: `Xét cạnh: Hướng sang [${getLabel(v)}]...` });

                if (!frame.visited.has(v)) {
                    yield addStep({ type: 'info', path: [...frame.path], current: frame.u, action: `-> Đỉnh [${getLabel(v)}] hợp lệ, tiến tới.` });
                    let newVisited = new Set(frame.visited); newVisited.add(v);
                    stack.push({ u: v, path: [...frame.path, v], visited: newVisited, neighbors: adj[v], nIdx: 0, isPushed: false });
                } else {
                    yield addStep({ type: 'skip', path: [...frame.path], action: `-> Bỏ qua [${getLabel(v)}], đã có trong Stack.` });
                }
            } else {
                if (frame.path.length < nodes.length && frame.neighbors.length === 0) {
                    yield addStep({ type: 'deadend', path: [...frame.path], current: frame.u, action: `Ngõ cụt tại [${getLabel(frame.u)}]!` });
                }
                stack.pop();
                let parent = stack.length > 0 ? stack[stack.length - 1].u : null;
                let poppedPath = frame.path.slice(0, -1);
                yield addStep({ type: 'backtrack', path: poppedPath, current: parent, backtracked: frame.u, action: `Pop: Rút [${getLabel(frame.u)}] khỏi Stack.` });
            }
        }
    }
    if (foundCount === 0) yield addStep({ type: 'fail', path: [], action: 'Đã vét cạn nhưng không có đường đi Hamilton nào.' });
    else yield addStep({ type: 'finish', path: [], action: `Hoàn tất toàn bộ tiến trình! Tổng cộng: ${foundCount} đường đi.` });
  }

  const generateSteps = () => {
    const startNodesToRun = getEffectiveStartNodes();
    if (startNodesToRun.length === 0) { showToast("Chưa có đỉnh nào trên bản đồ!"); return; }

    resetVisualizer();
    stepGenRef.current = createStepGenerator(nodes, edges, startNodesToRun, searchAllNodes);
    setIsPlaying(true);
    if (window.innerWidth < 768) setShowMobileRight(false);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && stepGenRef.current && !isSkipping) {
      interval = setInterval(() => {
        const nextVal = stepGenRef.current.next();
        
        if (nextVal.done) {
          setIsPlaying(false);
          stepGenRef.current = null;
        } else {
          const newStep = nextVal.value;
          allLogsRef.current.push(newStep);
          if (allLogsRef.current.length > 50000) allLogsRef.current.shift();
          
          setCurrentStepData(newStep);
          setForceRender(prev => prev + 1);

          if (newStep.type === 'success') {
            setIsPlaying(false); 
            setFoundPaths(curr => {
              if (!curr.some(p => p.path.join() === newStep.path.join())) {
                return [...curr, { path: newStep.path, startNodeLabel: newStep.startNodeLabel }];
              }
              return curr;
            });
          }
        }
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, isSkipping]); 

  const handleSkipToNextResult = async () => {
    if (!stepGenRef.current) return;
    setIsPlaying(false);
    setIsSkipping(true);

    await new Promise(r => setTimeout(r, 10)); 

    let found = false;
    let iters = 0;
    let lastTime = performance.now();
    let lastStep = null;

    while (!found) {
      const next = stepGenRef.current.next();
      if (next.done) {
        showToast("Đã vét cạn, không còn kết quả nào khác!");
        stepGenRef.current = null;
        break;
      }
      
      lastStep = next.value;
      allLogsRef.current.push(lastStep);
      if (allLogsRef.current.length > 50000) allLogsRef.current.shift();

      if (lastStep.type === 'success') {
        found = true;
        setFoundPaths(curr => {
          if (!curr.some(p => p.path.join() === lastStep.path.join())) {
            return [...curr, { path: lastStep.path, startNodeLabel: lastStep.startNodeLabel }];
          }
          return curr;
        });
        setViewingStaticPath(lastStep.path);
        setCurrentStepData(lastStep);
        setForceRender(prev => prev + 1);
        break;
      }

      iters++;
      if (iters % 2000 === 0) {
        if (performance.now() - lastTime > 40) {
          setCurrentStepData(lastStep);
          setForceRender(prev => prev + 1);
          await new Promise(r => setTimeout(r, 0)); 
          lastTime = performance.now();
        }
      }
    }
    
    setIsSkipping(false);
  };

  const handleNextPath = () => {
    if (stepGenRef.current) {
      setViewingStaticPath(null); setIsPlaying(true);
    }
  };

  // =========================================================================

  let activePath = [];
  let currentActiveNode = null;
  let checkingEdge = null;
  let backtrackedNode = null;

  if (mode === 'play') {
    activePath = gamePath; currentActiveNode = gamePath[gamePath.length - 1];
  } else if (viewingStaticPath) {
    activePath = viewingStaticPath; currentActiveNode = viewingStaticPath[viewingStaticPath.length - 1];
  } else if (currentStepData) {
    activePath = currentStepData.path || [];
    currentActiveNode = currentStepData.current;
    checkingEdge = currentStepData.type === 'check_edge' ? { u: currentStepData.current, v: currentStepData.next } : null;
    backtrackedNode = currentStepData.type === 'backtrack' ? currentStepData.backtracked : null;
  }

  // Chỉnh null Pop animation nếu đang trong chế độ View kết quả
  if (viewingStaticPath) {
    backtrackedNode = null;
  }

  const effectiveStartNodes = getEffectiveStartNodes();
  const isPopping = !viewingStaticPath && currentStepData?.type === 'backtrack';
  const isCurrentStepSuccess = currentStepData?.type === 'success';
  const isPlayMode = mode === 'play';
  const isAlgorithmActive = isPlaying || isSkipping || (stepGenRef.current !== null && !isCurrentStepSuccess && !viewingStaticPath);

  const nodeDefaultFill = isDark ? "#1e293b" : "#ffffff";
  const nodeDefaultStroke = isDark ? "#475569" : "#cbd5e1";
  const textDefaultFill = isDark ? "#f8fafc" : "#0f172a";
  const edgeDefaultStroke = isDark ? "#334155" : "#94a3b8";
  const drawingEdgeStroke = isDark ? "#64748b" : "#94a3b8";
  const startNodeStroke = isDark ? "#6366f1" : "#4f46e5";
  const gridLineColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div id="hamilton-app-wrapper" className={`${theme} flex flex-col h-dvh w-full overflow-hidden font-sans selection:bg-indigo-500/30 touch-none`}>
      <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">

        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-indigo-600/95 backdrop-blur-sm text-white rounded-xl shadow-2xl font-bold text-sm text-center animate-[slideDownToast_0.3s_ease-out] border border-indigo-400/30 max-w-[90vw]">
            {toastMessage}
          </div>
        )}

        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-3 md:p-4 flex justify-between items-center shadow-sm dark:shadow-lg z-30 shrink-0 h-14 md:h-16 transition-colors duration-300">
          <button onClick={() => setShowMobileLeft(true)} className="md:hidden p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center md:justify-start">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              <Cpu size={20} className="text-white" />
            </div>
            <h1 className="text-base md:text-lg font-black bg-linear-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent uppercase tracking-wider truncate">
              Hamilton Simulator
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Đổi giao diện Sáng/Tối">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setShowMobileRight(true)} className="md:hidden p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40">
              <Settings2 size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {showMobileLeft && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowMobileLeft(false)} />}
          {showMobileRight && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowMobileRight(false)} />}

          <div className="hidden md:block shrink-0 pointer-events-none" style={{ width: '80px' }}></div>

          <div
            style={{ width: window.innerWidth >= 768 ? leftPanelWidth : '260px' }}
            className={`
              fixed left-0 top-14 md:top-0 bottom-0 md:inset-y-0 z-50 md:absolute md:z-30 shrink-0 
              bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 
              transform transition-all duration-300 ease-in-out select-none md:shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:md:shadow-[4px_0_24px_rgba(0,0,0,0.3)]
              ${showMobileLeft ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="w-full h-full p-3 md:p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pt-0 md:pt-2">
              <button onClick={() => setShowMobileLeft(false)} className="md:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 rounded-full bg-slate-100 dark:bg-slate-800 z-50">
                <X size={18} />
              </button>

              <div className="hidden md:flex items-center justify-between mb-2 shrink-0 px-1">
                {isSidebarExpanded && <div className="text-[16px] font-bold text-slate-500 uppercase tracking-widest truncate flex-1">Chỉnh sửa Map</div>}
                <button onClick={toggleSidebar} className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition shrink-0 mx-auto" title="Thu gọn / Mở rộng">
                  <Menu size={20} />
                </button>
              </div>

              <div className="md:hidden text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 pt-4">Công cụ bản đồ</div>

              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<Gamepad2 />} label="Tự chơi (Giải đố)" mode="play" current={mode} setMode={setMode} locked={isAlgorithmActive} activeClasses="text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-500/10 border-fuchsia-400 dark:border-fuchsia-500/50" />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<MousePointer2 />} label="Chọn / Kéo thả" mode="select" current={mode} setMode={setMode} locked={false} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<PlusCircle />} label="Thêm đỉnh" mode="addNode" current={mode} setMode={setMode} locked={isAlgorithmActive} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<GitMerge />} label="Nối cạnh" mode="addEdge" current={mode} setMode={setMode} locked={isAlgorithmActive} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<Trash2 />} label="Xóa (Đỉnh/Cạnh)" mode="remove" current={mode} setMode={setMode} locked={isAlgorithmActive} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<MapPin />} label="Chọn Gốc" mode="setStart" current={mode} setMode={setMode} locked={isAlgorithmActive || searchAllNodes} activeClasses="text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-400 dark:border-amber-500/50" />

              <button onClick={resetCurrentMap} className={`mt-1 flex items-center justify-center ${(window.innerWidth < 768 || isSidebarExpanded) ? 'justify-start px-3' : 'px-0'} gap-3 py-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30 rounded transition`}>
                <RefreshCw size={20} className="shrink-0" /> {(window.innerWidth < 768 || isSidebarExpanded) && <span className="text-[14px] font-bold truncate">Reset Màn</span>}
              </button>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1 shrink-0"></div>

              {(window.innerWidth < 768 || isSidebarExpanded) && <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate px-1">Cấp độ & Bản đồ</div>}

              <div className={`grid ${(window.innerWidth < 768 || isSidebarExpanded) ? 'grid-cols-5' : 'grid-cols-1'} gap-2 mb-2 shrink-0 px-1`}>
                <button onClick={() => { setCurrentLevel('custom'); setMode('select'); if(window.innerWidth < 768) setShowMobileLeft(false); }} title="Màn chơi tùy chỉnh của riêng bạn" className={`${(window.innerWidth < 768 || isSidebarExpanded) || currentLevel === 'custom' ? '' : 'hidden'} ${(window.innerWidth < 768 || isSidebarExpanded) ? 'col-span-5 py-2' : 'col-span-1 aspect-square'} flex items-center justify-center rounded border font-black text-[12px] transition-all uppercase tracking-wider ${currentLevel === 'custom' ? 'bg-amber-500 text-white border-amber-400 shadow-md dark:shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                  {(window.innerWidth < 768 || isSidebarExpanded) ? 'Màn Tùy chỉnh' : 'Cus'}
                </button>
                {MAP_LEVELS.map((lvl, index) => {
                  return (
                    <button key={lvl.id} onClick={() => { loadLevel(lvl, index); }} title={lvl.name} className={`${(window.innerWidth < 768 || isSidebarExpanded) || currentLevel === index ? '' : 'hidden'} flex items-center justify-center aspect-square rounded border font-black text-sm transition-all ${currentLevel === index ? 'bg-indigo-500 text-white border-indigo-400 shadow-md dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                      {index + 1}
                    </button>
                  )
                })}
                <button onClick={() => setShowRandomModal(true)} title="Tạo màn chơi ngẫu nhiên" className={`${(window.innerWidth < 768 || isSidebarExpanded) || currentLevel === 'random' ? '' : 'hidden'} flex items-center justify-center aspect-square rounded border font-black text-[12px] transition-all ${currentLevel === 'random' ? 'bg-emerald-500 text-white border-emerald-400 shadow-md dark:shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200'}`}>
                  RAN
                </button>
              </div>

              <div className={`mt-auto flex ${window.innerWidth < 768 || isSidebarExpanded ? 'flex-row gap-5' : 'flex-col gap-4 mb-5'} justify-center p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 md:mx-auto `}>
                <button onClick={() => handleZoom(1.2)} className="p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><ZoomIn size={24} /></button>
                <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><Maximize size={24} /></button>
                <button onClick={() => handleZoom(0.8)} className="p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><ZoomOut size={24} /></button>
              </div>
            </div>
          </div>

          <div
            className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950/80 shadow-inner flex flex-col"
            onPointerMove={onPointerMove} onPointerUp={onSvgPointerUp} onPointerLeave={onSvgPointerUp}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }} 
          >
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`, backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`, backgroundPosition: `${transform.x}px ${transform.y}px` }}></div>

            {mode === 'play' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-fuchsia-600/90 text-white rounded-full font-bold shadow-lg shadow-fuchsia-500/30 text-sm animate-pulse whitespace-nowrap">
                Chế độ Giải Đố: Chọn đỉnh kề nhau!
              </div>
            )}

            <svg ref={svgRef} className={`w-full flex-1 ${mode === 'addNode' ? 'cursor-crosshair' : (interaction.type === 'panning' ? 'cursor-grabbing' : 'cursor-grab')}`} onWheel={handleWheel} onPointerDown={onSvgPointerDown}>
              <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>

                {(interaction.type === 'drawingEdge') && (
                  <line
                    x1={nodes.find(n => n.id === interaction.sourceId)?.x} y1={nodes.find(n => n.id === interaction.sourceId)?.y}
                    x2={mouseCoords.x} y2={mouseCoords.y}
                    stroke={drawingEdgeStroke} strokeWidth={3} strokeDasharray="4 4" className="pointer-events-none opacity-60"
                  />
                )}

                {edges.map(edge => {
                  const source = nodes.find(n => n.id === edge.source); const target = nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;

                  let isPathEdge = false;
                  if ((activePath || []).length > 1) {
                    isPathEdge = activePath.some((n, i) => {
                      if (i === 0) return false;
                      const prev = activePath[i - 1]; return (prev === source.id && n === target.id) || (prev === target.id && n === source.id);
                    });
                  }

                  const isCheckingEdge = checkingEdge && ((checkingEdge.u === source.id && checkingEdge.v === target.id) || (checkingEdge.v === source.id && checkingEdge.u === target.id));
                  const isBacktrackEdge = isPopping && backtrackedNode && currentActiveNode && ((source.id === backtrackedNode && target.id === currentActiveNode) || (target.id === backtrackedNode && source.id === currentActiveNode));

                  let stroke = edgeDefaultStroke, strokeWidth = 3, strokeDash = "none", classes = "transition-all duration-300";

                  if (isBacktrackEdge) { stroke = isDark ? "#ef4444" : "#f87171"; strokeWidth = 5; strokeDash = "6,4"; classes += " animate-pulse"; }
                  else if (isPathEdge) { stroke = mode === 'play' ? (isDark ? "#d946ef" : "#c026d3") : (isDark ? "#10b981" : "#059669"); strokeWidth = 6; } 
                  else if (isCheckingEdge) { stroke = isDark ? "#f59e0b" : "#d97706"; strokeWidth = 4; strokeDash = "6,4"; classes += " animate-[dash_1s_linear_infinite]"; } 
                  else if (mode === 'remove' && !isAlgorithmActive && !viewingStaticPath) { classes += " hover:stroke-red-500 hover:stroke-[8px] cursor-pointer"; }

                  return <line key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDash} className={classes} onPointerDown={(e) => onEdgePointerDown(e, edge.id)} />;
                })}

                {(activePath || []).length > 1 && activePath.map((nodeId, idx) => {
                  if (idx === 0) return null;
                  const prevNode = nodes.find(n => n.id === activePath[idx - 1]); const currNode = nodes.find(n => n.id === nodeId);
                  if (!prevNode || !currNode) return null;
                  const midX = (prevNode.x + currNode.x) / 2, midY = (prevNode.y + currNode.y) / 2;
                  const angle = Math.atan2(currNode.y - prevNode.y, currNode.x - prevNode.x) * (180 / Math.PI);
                  const arrowColor = mode === 'play' ? (isDark ? "#fdf4ff" : "#f0abfc") : (isDark ? "#d1fae5" : "#059669");
                  return (
                    <g key={`arrow-${idx}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`} className="pointer-events-none transition-all duration-300 drop-shadow-md">
                      <polygon points="-10,-8 10,0 -10,8" fill={arrowColor} />
                    </g>
                  );
                })}

                {nodes.map(node => {
                  const isStart = effectiveStartNodes.includes(node.id) && !isAlgorithmActive && !viewingStaticPath;
                  const isInPath = (activePath || []).includes(node.id);
                  const isCurrent = currentActiveNode === node.id;
                  const isBacktracked = backtrackedNode === node.id;
                  const isPendingEdge = mode === 'addEdge' && pendingEdgeSource === node.id;
                  const isDeadendNode = currentStepData?.type === 'deadend' && currentStepData.current === node.id;

                  let fill = nodeDefaultFill, stroke = nodeDefaultStroke, strokeW = 2, radius = 24, zIndexClass = "", strokeDash = "none";

                  if (isCurrent && !isDeadendNode) {
                    fill = mode === 'play' ? (isDark ? "#d946ef" : "#c026d3") : (isDark ? "#f59e0b" : "#fbbf24"); 
                    stroke = mode === 'play' ? (isDark ? "#f0abfc" : "#a21caf") : (isDark ? "#fbbf24" : "#b45309"); strokeW = 4; radius = 28; 
                    zIndexClass = mode === 'play' ? (isDark ? `drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]` : `drop-shadow-lg`) : (isDark ? `drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]` : `drop-shadow-lg`);
                  } else if (isPendingEdge) {
                    fill = isDark ? "#1e3a8a" : "#eff6ff"; stroke = isDark ? "#60a5fa" : "#3b82f6"; strokeW = 4; radius = 26; zIndexClass = isDark ? `drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]` : `drop-shadow-md`;
                  } else if (isDeadendNode || isBacktracked) {
                    fill = isDark ? "#ef4444" : "#f87171"; stroke = isDark ? "#f87171" : "#b91c1c"; strokeW = 4; radius = 28; zIndexClass = "drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]";
                  } else if (isInPath) {
                    fill = mode === 'play' ? (isDark ? "#a21caf" : "#d946ef") : (isDark ? "#10b981" : "#34d399"); 
                    stroke = mode === 'play' ? (isDark ? "#d946ef" : "#86198f") : (isDark ? "#34d399" : "#047857"); strokeW = 3;
                  } else if (isStart) {
                    stroke = startNodeStroke; strokeW = 4;
                  }

                  let interactiveClasses = '';
                  if (!isAlgorithmActive) {
                    interactiveClasses = mode === 'remove' ? 'hover:stroke-red-500 hover:fill-red-200 dark:hover:fill-red-900 cursor-pointer' :
                      mode === 'addEdge' ? 'hover:stroke-indigo-500 dark:hover:stroke-indigo-400 hover:fill-indigo-100 dark:hover:fill-indigo-900 cursor-pointer' :
                      (mode === 'setStart' || mode === 'select') ? 'hover:stroke-emerald-500 dark:hover:stroke-emerald-400 cursor-pointer cursor-grab active:cursor-grabbing' : 
                      mode === 'play' ? 'hover:stroke-fuchsia-400 cursor-pointer' : 'cursor-grab active:cursor-grabbing';
                  } else { interactiveClasses = 'cursor-grab active:cursor-grabbing hover:stroke-amber-500 dark:hover:stroke-amber-400'; }

                  return (
                    <g key={node.id} data-nodeid={node.id} transform={`translate(${node.x}, ${node.y})`} onPointerDown={(e) => onNodePointerDown(e, node.id)} onPointerUp={(e) => onNodePointerUp(e, node.id)} className={`transition-all duration-300 ${interactiveClasses} ${zIndexClass}`}>
                      <circle r={radius} fill={fill} stroke={stroke} strokeWidth={strokeW} strokeDasharray={strokeDash} className="transition-all duration-300" />
                      <text textAnchor="middle" dominantBaseline="central" fill={mode === 'play' && isInPath ? "#ffffff" : textDefaultFill} className="font-bold select-none pointer-events-none text-sm">{node.label}</text>
                      {isStart && <text y={-35} textAnchor="middle" className={`text-[10px] font-black ${isDark ? 'fill-indigo-400' : 'fill-indigo-600'} pointer-events-none`}>GỐC</text>}
                    </g>
                  );
                })}
              </g>
            </svg>

            {showLogs && (
              <div style={{ height: logHeight }} className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.5)] relative z-20 shrink-0">
                <div onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingLog' }); }} className="flex absolute top-0 left-0 w-full h-4 cursor-ns-resize z-30 hover:bg-blue-500/20 dark:hover:bg-blue-500/50 transition-colors justify-center items-center group">
                  <GripHorizontal size={16} className="text-slate-400 dark:text-slate-500 opacity-30 group-hover:opacity-100" />
                </div>

                <div className="flex flex-col h-full transition-[padding] duration-300 ease-in-out" style={{ paddingLeft: isSidebarExpanded && window.innerWidth >= 768 ? leftPanelWidth - 80 : 0 }}>
                  <div className="px-3 py-1.5 mt-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-base text-slate-500 dark:text-slate-400 shrink-0">
                    <span className="flex items-center gap-1 font-bold"><Terminal size={18} /> SYSTEM LOG (Tiến trình duyệt)</span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{totalLogs > 500 ? 'Hiển thị 500 dòng (Cuộn lên để tải cũ)' : `Hiển thị ${totalLogs} dòng`}</span>
                  </div>
                  
                  {/* VIRTUAL LOG CONTAINER */}
                  <div ref={logContainerRef} onScroll={handleLogScroll} className="flex-1 p-2 overflow-y-auto font-mono text-xs bg-white dark:bg-slate-950 relative">
                    
                    {totalLogs === 0 && !isSkipping && <div className="text-slate-500 dark:text-slate-600 italic px-2">Đang chờ lệnh chạy thuật toán...</div>}
                    
                    {totalLogs > 0 && (
                      <div style={{ height: `${totalLogHeight}px`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: `translateY(${logOffsetY}px)` }}>
                          {visibleLogsVirtual.map(s => (
                            <div key={`log-${s.id}`} style={{ height: `${LOG_ITEM_HEIGHT}px` }} className={`flex items-center px-1 truncate
                               ${s.type === 'visit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}
                               ${s.type === 'backtrack' ? 'text-red-500 font-bold bg-red-50/80 dark:bg-red-900/20' : ''}
                               ${s.type === 'check_edge' ? 'text-amber-600 dark:text-amber-300' : ''}
                               ${s.type === 'skip' ? 'text-slate-400 dark:text-slate-500' : ''}
                               ${s.type === 'success' ? 'text-white font-bold bg-emerald-500 dark:bg-emerald-600' : ''}
                               ${s.type === 'info' ? 'text-blue-600 dark:text-blue-300' : ''}
                             `}>
                              <span className="opacity-40 select-none w-10 shrink-0">[{s.id > 0 ? s.id : '-'}]</span>
                              <span className="truncate flex-1 flex items-center">
                                {s.type === 'deadend' ? <span className="bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500 px-1 rounded">{s.action}</span> : renderLogAction(s)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODAL: KẾT QUẢ TÌM SIÊU TỐC - TÍCH HỢP VIRTUAL SCROLLING KHÔNG GIẬT */}
            {showFastResultsModal && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm z-50 flex flex-col p-4 md:p-8">
                <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0 pt-10 md:pt-0">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Zap size={24} className="md:w-7 md:h-7" /> Kết quả Tìm Siêu Tốc 
                    {isSearchingFast ? (
                      <span className="text-sm bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-1 rounded-full animate-pulse ml-2 flex items-center gap-1"><Loader2 size={14} className="animate-spin"/> Đang quét... ({fastSearchMetrics.iters} nhánh)</span>
                    ) : (
                      <span className="text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-1 rounded-full ml-2">Đã xong ({fastSearchMetrics.iters} nhánh)</span>
                    )}
                  </h2>
                  <div className="flex items-center gap-2">
                    {isSearchingFast && (
                      <button onClick={cancelFastSearch} className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/40 rounded flex items-center gap-1 font-bold text-sm transition"><StopCircle size={18}/> Dừng lại</button>
                    )}
                    <button onClick={() => setShowFastResultsModal(false)} className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-red-500 hover:text-white dark:text-white rounded transition shadow-sm"><X size={20} className="md:w-6 md:h-6" /></button>
                  </div>
                </div>
                
                <div className="mb-3 text-sm text-slate-500 dark:text-slate-400 font-bold">
                  Tìm thấy tổng cộng <span className="text-emerald-600 dark:text-emerald-400 text-lg">{fastSearchMetrics.paths}</span> đường đi
                </div>

                <div 
                  className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl relative"
                  onScroll={(e) => setFastGridScroll(e.target.scrollTop)}
                  ref={fastGridRef}
                >
                  {totalFastItems === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 py-10">
                      {isSearchingFast ? <Loader2 size={40} className="animate-spin mb-4 text-blue-500 opacity-50" /> : <div className="mb-4 text-3xl opacity-50">📭</div>}
                      <span>{isSearchingFast ? "Đang luồn lách qua các đỉnh..." : "Không tìm thấy đường đi Hamilton nào trên bản đồ này!"}</span>
                    </div>
                  ) : (
                    <div style={{ height: `${totalFastHeight}px`, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '12px', transform: `translateY(${fastOffsetY}px)` }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3" style={{ gridAutoRows: '76px' }}>
                          {visibleFastResults.map((path, relativeIdx) => {
                            const actualIdx = startFastIndex + relativeIdx;
                            return (
                              <button key={actualIdx} onClick={() => { setViewingStaticPath(path.path); setShowFastResultsModal(false); }} className="p-3 w-full h-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-lg text-left transition-all shadow-sm group">
                                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-200">Đường đi {actualIdx + 1} (đỉnh {path.startNodeLabel})</div>
                                <div className="font-mono text-sm text-slate-800 dark:text-white flex flex-wrap items-center gap-1">
                                  {path.path.map((n, i) => (
                                    <React.Fragment key={i}>
                                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">{getLabel(n)}</span>
                                      {i < path.path.length - 1 && <ChevronRight size={12} className="opacity-50" />}
                                    </React.Fragment>
                                  ))}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* MODAL: TẠO BẢN ĐỒ NGẪU NHIÊN */}
            {showRandomModal && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-5 md:p-6 w-full max-w-sm border border-slate-200 dark:border-slate-700 animate-[slideDownIn_0.3s_ease-out]">
                  <div className="flex justify-between items-center mb-5 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Dices size={22} /> Cấu hình Map Random
                    </h2>
                    <button onClick={() => setShowRandomModal(false)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded transition"><X size={20} /></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Đỉnh tối thiểu (Min: 3)</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleMinNodesChange(randMinNodes - 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition font-bold">-</button>
                        <input type="number" min="3" max="14" value={randMinNodes} onChange={(e) => handleMinNodesChange(parseInt(e.target.value) || 3)} className="w-12 h-8 text-center border border-slate-300 dark:border-slate-600 rounded font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-900 focus:outline-hidden focus:border-emerald-500 appearance-none m-0 p-0" />
                        <button onClick={() => handleMinNodesChange(randMinNodes + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition font-bold">+</button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Đỉnh tối đa (Max: 15)</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleMaxNodesChange(randMaxNodes - 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition font-bold">-</button>
                        <input type="number" min={randMinNodes + 1} max="15" value={randMaxNodes} onChange={(e) => handleMaxNodesChange(parseInt(e.target.value) || (randMinNodes + 1))} className="w-12 h-8 text-center border border-slate-300 dark:border-slate-600 rounded font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-900 focus:outline-hidden focus:border-emerald-500 appearance-none m-0 p-0" />
                        <button onClick={() => handleMaxNodesChange(randMaxNodes + 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition font-bold">+</button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Mật độ sinh cạnh phụ</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">{randEdgePercent}%</span>
                      </div>
                      <input type="range" min="2" max="70" value={randEdgePercent} onChange={(e) => setRandEdgePercent(parseInt(e.target.value))} className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                      <p className="text-[10px] text-slate-500 mt-2 italic leading-tight">* Mặc định luôn có các cạnh tạo khung liên thông để đảm bảo không có đỉnh nào bị cô lập.</p>
                    </div>

                    <button onClick={generateRandomMap} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg shadow-md transition-all flex justify-center items-center gap-2 mt-4">
                      <Dices size={20} /> TẠO BẢN ĐỒ NGAY
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{ width: window.innerWidth >= 768 ? rightPanelWidth : '320px' }}
            className={`
              fixed right-0 top-14 md:top-0 bottom-0 md:inset-y-0 z-50 md:static md:z-20 shrink-0 
              bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none
              transform transition-transform duration-300 ease-in-out select-none
              ${showMobileRight ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}
          >
            <button onClick={() => setShowMobileRight(false)} className="md:hidden absolute top-4 left-4 p-2 text-slate-500 hover:text-red-500 rounded-full bg-slate-100 dark:bg-slate-800 z-50">
              <X size={18} />
            </button>
            <div onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingRight' }); }} className="hidden md:flex absolute top-0 -left-2 w-4 h-full cursor-col-resize z-30 hover:bg-blue-500/20 transition-colors justify-center items-center group">
              <div className="w-1 h-12 bg-slate-300 dark:bg-slate-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>

            <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden pt-14 md:pt-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shrink-0">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-sm font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={20} className="text-blue-500 dark:text-blue-400" /> Bộ điều khiển
                  </h2>
                  <button onClick={resetVisualizer} className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-600 hover:text-red-500 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/50 rounded text-sm font-bold flex items-center gap-1 transition shadow-sm">
                    <RotateCcw size={18} /> <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label className={`flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 transition shadow-sm ${isPlayMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="checkbox" disabled={isPlayMode} checked={searchAllNodes} onChange={(e) => { setSearchAllNodes(e.target.checked); resetVisualizer(); }} className="accent-blue-500 w-4 h-4 disabled:cursor-not-allowed" />
                    <span>Tìm trên <b>Mọi đỉnh</b> thay vì Gốc</span>
                  </label>
                  <button disabled={isPlayMode || isSearchingFast} onClick={runFastGlobalSearch} className={`w-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 py-2 rounded border border-slate-300 dark:border-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm ${isPlayMode || isSearchingFast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-white hover:border-blue-400'}`}>
                    <Zap size={16} /> {isSearchingFast ? 'Đang chạy...' : 'Tìm siêu tốc (Xuất List)'}
                  </button>
                </div>

                <div className="flex gap-2 mb-4">
                  {!stepGenRef.current ? (
                    <button disabled={isPlayMode} onClick={generateSteps} className={`flex-1 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-md ${isPlayMode ? 'bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                      <Play size={18} fill="currentColor" /> CHẠY BACKTRACK
                    </button>
                  ) : isCurrentStepSuccess ? (
                    <button disabled={isPlayMode} onClick={handleNextPath} className={`flex-1 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-md animate-pulse ${isPlayMode ? 'bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 dark:shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}>
                      <MapIcon size={18} /> TÌM ĐƯỜNG TIẾP
                    </button>
                  ) : (
                    <>
                      <button disabled={isSkipping || isPlayMode} onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'} ${isPlayMode ? 'opacity-50 bg-slate-400 dark:bg-slate-700' : ''}`}>
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                      <button disabled={isSkipping || isPlayMode} onClick={handleSkipToNextResult} title="Tua nhanh đến kết quả tiếp theo" className={`w-14 bg-slate-200 dark:bg-slate-800 py-2 rounded flex justify-center text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm ${isPlayMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
                        {isSkipping ? <Loader2 size={18} className="animate-spin" /> : <SkipForward size={18} />}
                      </button>
                    </>
                  )}
                </div>

                <div className={`flex items-center gap-2 md:gap-3 ${isPlayMode ? 'opacity-50' : ''}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chậm</span>
                  <input type="range" disabled={isPlayMode} min="10" max="1500" step="10" value={1600 - speed} onChange={(e) => setSpeed(1600 - Number(e.target.value))} className="flex-1 accent-blue-500 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none disabled:cursor-not-allowed cursor-pointer" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Nhanh</span>

                  <button disabled={isPlayMode} onClick={() => setShowLogs(!showLogs)} className={`p-1.5 ml-1 rounded transition text-xs flex items-center justify-center border shadow-sm ${isPlayMode ? 'cursor-not-allowed' : ''} ${showLogs ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-transparent'}`} title="Bật/Tắt Log Tiến trình">
                    {showLogs ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-transparent">
                <div className="flex-1 p-4 overflow-y-auto relative">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2"><GitMerge size={14} /> Stack Trực Quan</h3>
                  
                  {/* TEXT NHỎ THÔNG BÁO ĐANG XEM LẠI ĐƯỜNG ĐI */}
                  {viewingStaticPath && (
                     <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-3 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded inline-block border border-emerald-200 dark:border-emerald-800">
                       {(() => {
                         let idx = foundPaths.findIndex(p => p.path.join() === viewingStaticPath.join());
                         if (idx === -1) idx = allFastResultsRef.current.findIndex(p => p.path.join() === viewingStaticPath.join());
                         return `Đang xem lại đường đi số ${idx >= 0 ? idx + 1 : '?'}`;
                       })()}
                     </div>
                  )}

                  <div className="relative pt-2">
                    {(activePath || []).length === 0 && !isPopping && <div className="text-slate-500 dark:text-slate-600 text-sm italic text-center py-4 border border-dashed border-slate-300 dark:border-slate-700 rounded">Stack trống</div>}

                    {isPopping && backtrackedNode && (
                      <div key={`pop-${currentStepData?.id}`} className="absolute top-2 left-0 w-full flex items-center gap-2 md:gap-3 animate-[slideUpOut_0.5s_ease-out_forwards] z-10 h-10 md:h-12">
                        <div className="w-5 md:w-6 text-right text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-mono">#{activePath.length + 1}</div>
                        <div className="flex-1 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded p-2 flex items-center gap-2 md:gap-3 shadow-sm h-full box-border">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-red-500 dark:bg-red-600 border border-red-600 dark:border-red-700 text-white flex items-center justify-center font-bold text-[10px] md:text-xs shadow-inner">{getLabel(backtrackedNode)}</div>
                          <span className="text-xs md:text-sm text-red-600 dark:text-red-300 font-bold">Pop (Rút khỏi Stack)</span>
                        </div>
                      </div>
                    )}

                    <div className={`flex flex-col gap-2 transition-all duration-500 ${isPopping ? 'translate-y-12 md:translate-y-14' : 'translate-y-0'}`}>
                      {(activePath || []).slice().reverse().map((nodeId, idx) => {
                        const actualStackIndex = activePath.length - 1 - idx;
                        const isNewest = !isPopping && idx === 0 && !viewingStaticPath;
                        return (
                          <div key={`stack-${nodeId}-${actualStackIndex}`} className={`flex items-center gap-2 md:gap-3 h-10 md:h-12 ${isNewest ? 'animate-[slideDownIn_0.3s_ease-out_forwards]' : ''}`}>
                            <div className="w-5 md:w-6 text-right text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-mono">#{actualStackIndex + 1}</div>
                            <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-2 flex items-center gap-2 md:gap-3 shadow-sm h-full box-border">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-[10px] md:text-xs">{getLabel(nodeId)}</div>
                              <span className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-medium">Nằm trong Stack</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col transition-all duration-300 shrink-0 ${showResultsHistory ? 'h-48 md:h-56' : 'h-10'}`}>
                  <button onClick={() => setShowResultsHistory(!showResultsHistory)} className="px-3 md:px-4 py-2.5 bg-slate-100 dark:bg-slate-950 flex justify-between items-center text-[10px] md:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
                    <span className="flex items-center gap-2"><List size={16} /> Kết Quả Đã Tìm ({foundPaths.length})</span>
                    {showResultsHistory ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>

                  {showResultsHistory && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {foundPaths.length === 0 ? (
                        <div className="text-center text-base text-slate-500 dark:text-slate-600 py-4 italic">Chưa tìm thấy đường đi nào...</div>
                      ) : (
                        foundPaths.map((s, i) => {
                          const isActive = viewingStaticPath === s.path;
                          return (
                            <button key={i} onClick={() => setViewingStaticPath(s.path)} className={`w-full text-left text-xs p-2 rounded transition-all border shadow-sm ${isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                              Đường đi {i + 1} (đỉnh {s.startNodeLabel})
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.4) transparent; }
        .dark * { scrollbar-color: rgba(71, 85, 105, 0.5) transparent; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background-color: rgba(148, 163, 184, 0.4); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background-color: rgba(148, 163, 184, 0.7); }
        .dark ::-webkit-scrollbar-thumb { background-color: rgba(71, 85, 105, 0.5); }
        .dark ::-webkit-scrollbar-thumb:hover { background-color: rgba(71, 85, 105, 0.8); }

        @keyframes dash { to { stroke-dashoffset: -10; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-3px, 0); } 75% { transform: translate(3px, 0); } }
        @keyframes slideDownIn { 0% { opacity: 0; transform: translateY(-48px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes slideUpOut { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-48px); } }
        @keyframes slideDownToast { 0% { opacity: 0; transform: translate(-50%, -20px); } 100% { opacity: 1; transform: translate(-50%, 0); } }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}

function ToolBtn({ icon, label, mode, current, setMode, locked, activeClasses, isExpanded }) {
  const isActive = mode === current;
  const defaultActiveClass = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/50 font-bold";
  const activeStyle = activeClasses || defaultActiveClass;

  return (
    <button onClick={() => setMode(mode)} disabled={locked} title={label} className={`w-full flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center px-0'} gap-3 py-2 md:py-2.5 rounded-lg border transition-all shadow-sm ${locked ? 'opacity-30 cursor-not-allowed border-transparent shadow-none' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'} ${isActive ? activeStyle : 'border-transparent text-slate-600 dark:text-slate-400 bg-white dark:bg-transparent shadow-none'}`}>
      <span className={`shrink-0 ${isActive ? "" : "opacity-80"}`}>{React.cloneElement(icon, { size: 20 })}</span>
      {isExpanded && <span className="text-xs md:text-[14px] font-medium flex-1 truncate text-left">{label}</span>}
    </button>
  );
}