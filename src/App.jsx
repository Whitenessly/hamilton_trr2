import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, RotateCcw,
  MousePointer2, PlusCircle, GitMerge, Trash2,
  MapPin, Trash, Cpu, ChevronRight, ChevronLeft,
  ZoomIn, ZoomOut, Maximize, Zap, List,
  Eye, EyeOff, Terminal, ChevronDown, ChevronUp, Map as MapIcon, X, GripHorizontal, Menu
} from 'lucide-react';

const STORAGE_KEY = 'hamiltonian_map_save_v7';

// --- DANH SÁCH MÀN CHƠI (LEVELS) ---
const MAP_LEVELS = [
  {
    id: 1, name: "Ngôi nhà nhỏ",
    nodes: [{ id: 'n1', x: 300, y: 150, label: '1' }, { id: 'n2', x: 200, y: 250, label: '2' }, { id: 'n3', x: 400, y: 250, label: '3' }, { id: 'n4', x: 200, y: 400, label: '4' }, { id: 'n5', x: 400, y: 400, label: '5' }],
    edges: [{ id: 'e1', source: 'n1', target: 'n2' }, { id: 'e2', source: 'n1', target: 'n3' }, { id: 'e3', source: 'n2', target: 'n3' }, { id: 'e4', source: 'n2', target: 'n4' }, { id: 'e5', source: 'n3', target: 'n5' }, { id: 'e6', source: 'n4', target: 'n5' }]
  }
];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [nextEdgeId, setNextEdgeId] = useState(1);
  const [startNode, setStartNode] = useState(null);

  // --- LỊCH SỬ THAO TÁC (UNDO / CTRL + Z) ---
  const [past, setPast] = useState([]);

  const [mode, setMode] = useState('select');
  const [interaction, setInteraction] = useState({ type: 'none' });
  const [isClick, setIsClick] = useState(true);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  // Sidebar Widths & Toggle
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250); // Mặc định ~250px
  const [rightPanelWidth, setRightPanelWidth] = useState(384); // Mặc định ~384px

  // System Log Resizing
  const [logHeight, setLogHeight] = useState(200);

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);

  const [searchAllNodes, setSearchAllNodes] = useState(false);
  const [showLogs, setShowLogs] = useState(true);
  const [showResultsHistory, setShowResultsHistory] = useState(true);
  const [foundPaths, setFoundPaths] = useState([]);
  const [viewingStaticPath, setViewingStaticPath] = useState(null);
  const [fastResults, setFastResults] = useState([]);
  const [showFastResultsModal, setShowFastResultsModal] = useState(false);

  const svgRef = useRef(null);
  const logEndRef = useRef(null);

  // Ghi nhận trạng thái hiện tại vào lịch sử để chuẩn bị Undo
  const pushHistory = () => {
    setPast(prev => [...prev, {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      startNode,
      nextNodeId,
      nextEdgeId
    }]);
  };

  // Hàm Undo (Xử lý khi ấn Ctrl + Z)
  const handleUndo = () => {
    setPast(prevPast => {
      if (prevPast.length === 0) return prevPast;
      const previousState = prevPast[prevPast.length - 1];

      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setStartNode(previousState.startNode);
      setNextNodeId(previousState.nextNodeId);
      setNextEdgeId(previousState.nextEdgeId);

      return prevPast.slice(0, -1);
    });
  };

  // Bắt sự kiện bàn phím cho Ctrl + Z
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setStartNode(data.startNode || null);
        setNextNodeId(Math.max(0, ...(data.nodes || []).map(n => parseInt(n.id.replace(/\D/g, '')) || 0)) + 1);
        setNextEdgeId(Math.max(0, ...(data.edges || []).map(e => parseInt(e.id.replace(/\D/g, '')) || 0)) + 1);
      } catch (e) {
        loadLevel(MAP_LEVELS[0]);
      }
    } else {
      loadLevel(MAP_LEVELS[0]);
    }
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, startNode }));
    }
  }, [nodes, edges, startNode]);

  // Handle Resizing Log & Panels
  useEffect(() => {
    if (interaction.type !== 'resizingLog' && interaction.type !== 'resizingLeft' && interaction.type !== 'resizingRight') return;

    const handlePointerMove = (e) => {
      if (interaction.type === 'resizingLog') {
        const newHeight = window.innerHeight - e.clientY;
        setLogHeight(Math.max(60, Math.min(newHeight, window.innerHeight * 0.8)));
      } else if (interaction.type === 'resizingLeft') {
        const newWidth = Math.max(64, Math.min(e.clientX, window.innerWidth * 0.4));
        setLeftPanelWidth(newWidth);
        setIsSidebarExpanded(newWidth > 100);
      } else if (interaction.type === 'resizingRight') {
        const newWidth = window.innerWidth - e.clientX;
        setRightPanelWidth(Math.max(200, Math.min(newWidth, window.innerWidth * 0.5)));
      }
    };

    const handlePointerUp = () => setInteraction({ type: 'none' });

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interaction.type]);

  const toggleSidebar = () => {
    if (isSidebarExpanded) {
      setLeftPanelWidth(64);
      setIsSidebarExpanded(false);
    } else {
      setLeftPanelWidth(250);
      setIsSidebarExpanded(true);
    }
  };

  const loadLevel = (lvl) => {
    pushHistory();
    setNodes(lvl.nodes);
    setEdges(lvl.edges);
    setStartNode(null);
    resetVisualizer();
    setNextNodeId(Math.max(0, ...lvl.nodes.map(n => parseInt(n.id.replace(/\D/g, '')) || 0)) + 1);
    setNextEdgeId(Math.max(0, ...lvl.edges.map(e => parseInt(e.id.replace(/\D/g, '')) || 0)) + 1);
  };

  const clearMapData = () => {
    if (confirm('Bạn có chắc muốn xóa sạch bản đồ hiện tại?')) {
      pushHistory();
      setNodes([]); setEdges([]); setStartNode(null);
      resetVisualizer();
    }
  };

  const getSvgCoords = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return {
      x: (clientX - rect.left - transform.x) / transform.scale,
      y: (clientY - rect.top - transform.y) / transform.scale
    };
  };

  const onSvgPointerDown = (e) => {
    setIsClick(true);
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    if (mode === 'select' || isAlgorithmActive) {
      setInteraction({ type: 'panning', startX: e.clientX - transform.x, startY: e.clientY - transform.y });
    }
  };

  const onNodePointerDown = (e, nodeId) => {
    e.stopPropagation();
    setIsClick(true);
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    if (mode === 'addEdge' && !isAlgorithmActive) {
      setInteraction({ type: 'drawingEdge', sourceId: nodeId });
      setMouseCoords(getSvgCoords(e));
    } else if (mode === 'remove' && !isAlgorithmActive) {
      // do nothing down
    } else if (mode === 'setStart' && !isAlgorithmActive) {
      // do nothing down
    } else {
      if (!isAlgorithmActive) {
        pushHistory(); // Lưu lịch sử trước khi bắt đầu kéo đỉnh đi chỗ khác
      }
      setInteraction({ type: 'draggingNode', nodeId });
    }
  };

  const onEdgePointerDown = (e, edgeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;
    if (isAlgorithmActive) return;

    if (mode === 'remove') {
      pushHistory();
      setEdges(edges.filter(edge => edge.id !== edgeId));
    }
  };

  const onPointerMove = (e) => {
    setIsClick(false);
    if (interaction.type === 'panning') {
      setTransform(prev => ({ ...prev, x: e.clientX - interaction.startX, y: e.clientY - interaction.startY }));
    } else if (interaction.type === 'draggingNode') {
      const coords = getSvgCoords(e);
      setNodes(nodes.map(n => n.id === interaction.nodeId ? { ...n, x: coords.x, y: coords.y } : n));
    } else if (interaction.type === 'drawingEdge') {
      setMouseCoords(getSvgCoords(e));
    }
  };

  const onSvgPointerUp = (e) => {
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;
    if (isClick && mode === 'addNode' && !isAlgorithmActive) {
      pushHistory();
      const coords = getSvgCoords(e);
      setNodes([...nodes, { id: `n${nextNodeId}`, x: coords.x, y: coords.y, label: `${nextNodeId}` }]);
      setNextNodeId(prev => prev + 1);
    }
    if (interaction.type !== 'resizingLog') {
      setInteraction({ type: 'none' });
    }
  };

  const onNodePointerUp = (e, nodeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    if (interaction.type === 'drawingEdge' && interaction.sourceId !== nodeId && !isAlgorithmActive) {
      const exists = edges.some(edge => (edge.source === interaction.sourceId && edge.target === nodeId) || (edge.target === interaction.sourceId && edge.source === nodeId));
      if (!exists) {
        pushHistory();
        setEdges([...edges, { id: `e${nextEdgeId}`, source: interaction.sourceId, target: nodeId }]);
        setNextEdgeId(prev => prev + 1);
      }
    } else if (isClick && !isAlgorithmActive) {
      if (mode === 'remove') {
        pushHistory();
        setNodes(nodes.filter(n => n.id !== nodeId));
        setEdges(edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
        if (startNode === nodeId) setStartNode(null);
      } else if (mode === 'setStart' || mode === 'select') {
        if (startNode !== nodeId) {
          pushHistory();
          setStartNode(nodeId);
        }
      }
    }

    if (interaction.type !== 'resizingLog') {
      setInteraction({ type: 'none' });
    }
  };

  const handleZoom = (factor) => setTransform(prev => ({ ...prev, scale: Math.min(Math.max(prev.scale * factor, 0.3), 3) }));
  const handleWheel = (e) => {
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    let newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTransform({
      x: mouseX - (mouseX - transform.x) * (newScale / transform.scale),
      y: mouseY - (mouseY - transform.y) * (newScale / transform.scale),
      scale: newScale
    });
  };

  const resetVisualizer = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setViewingStaticPath(null);
    setFoundPaths([]);
  };

  // Lấy gốc xuất phát
  const getEffectiveStartNodes = () => {
    if (searchAllNodes) return nodes.map(n => n.id);
    if (startNode) return [startNode];
    const defaultNode = nodes.find(n => n.label === '1' || n.id === 'n1') || nodes[0];
    if (defaultNode) return [defaultNode.id];
    return [];
  };

  // Thuật toán DFS xuất siêu tốc
  const runFastGlobalSearch = () => {
    const startNodesToRun = searchAllNodes ? nodes.map(n => n.id) : getEffectiveStartNodes();
    if (startNodesToRun.length === 0) {
      alert("Không tìm thấy đỉnh hợp lệ để bắt đầu!");
      return;
    }

    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => { adj[e.source].push(e.target); adj[e.target].push(e.source); });

    const allFoundPaths = [];
    const dfs = (u, currentPath, visited) => {
      currentPath.push(u); visited.add(u);
      if (currentPath.length === nodes.length) {
        allFoundPaths.push({ path: [...currentPath], startNodeLabel: getLabel(currentPath[0]) });
      } else {
        for (let v of adj[u]) if (!visited.has(v)) dfs(v, currentPath, visited);
      }
      visited.delete(u); currentPath.pop();
    };

    for (let sNode of startNodesToRun) dfs(sNode, [], new Set());

    setFastResults(allFoundPaths);
    setShowFastResultsModal(true);
    setSteps([]); setCurrentStepIndex(-1); setIsPlaying(false); setViewingStaticPath(null);
    if (!showResultsHistory) setShowResultsHistory(true);
  };

  // Thuật toán Backtracking tạo Visualize
  const generateSteps = () => {
    const startNodesToRun = getEffectiveStartNodes();
    if (startNodesToRun.length === 0) {
      alert("Chưa có đỉnh nào trên bản đồ!");
      return;
    }

    setViewingStaticPath(null);
    setFoundPaths([]);
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => { adj[e.source].push(e.target); adj[e.target].push(e.source); });

    const generatedSteps = [];
    const path = [];
    const visited = new Set();
    let foundCount = 0;

    function backtrack(u, rootNodeId) {
      path.push(u); visited.add(u);
      generatedSteps.push({ type: 'visit', path: [...path], current: u, action: `Push: Đưa [${getLabel(u)}] vào Stack.` });

      if (path.length === nodes.length) {
        foundCount++;
        const finalPath = [...path];
        generatedSteps.push({
          type: 'success', path: finalPath, current: u, startNodeLabel: getLabel(rootNodeId),
          action: `=> TÌM THẤY ĐƯỜNG HAMILTON #${foundCount}: ${finalPath.map(p => getLabel(p)).join('→')}`
        });
      } else {
        let hasValidNeighbor = false;
        for (let v of adj[u]) {
          generatedSteps.push({ type: 'check_edge', path: [...path], current: u, next: v, action: `Xét cạnh: Hướng sang [${getLabel(v)}]...` });
          if (!visited.has(v)) {
            hasValidNeighbor = true;
            generatedSteps.push({ type: 'info', path: [...path], current: u, action: `-> Đỉnh [${getLabel(v)}] hợp lệ, tiến tới.` });
            backtrack(v, rootNodeId);
          } else {
            generatedSteps.push({ type: 'skip', path: [...path], action: `-> Bỏ qua [${getLabel(v)}], đã có trong Stack.` });
          }
        }
        if (!hasValidNeighbor) generatedSteps.push({ type: 'deadend', path: [...path], current: u, action: `Ngõ cụt tại [${getLabel(u)}]!` });
      }

      visited.delete(u); path.pop();
      generatedSteps.push({ type: 'backtrack', path: [...path], current: path[path.length - 1] || null, backtracked: u, action: `Pop: Rút [${getLabel(u)}] khỏi Stack.` });
    }

    generatedSteps.push({ type: 'start', path: [], current: null, action: `Khởi tạo thuật toán Backtracking ${searchAllNodes ? 'trên mọi đỉnh' : 'từ đỉnh Gốc'}...` });

    for (let sNode of startNodesToRun) {
      if (searchAllNodes) generatedSteps.push({ type: 'info', path: [], current: sNode, action: `=== BẮT ĐẦU TÌM TỪ GỐC [${getLabel(sNode)}] ===` });
      backtrack(sNode, sNode);
    }

    if (foundCount === 0) generatedSteps.push({ type: 'fail', path: [], action: 'Đã vét cạn nhưng không có đường đi Hamilton nào.' });
    else generatedSteps.push({ type: 'finish', path: [], action: `Hoàn tất toàn bộ tiến trình! Tổng cộng: ${foundCount} đường đi.` });

    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          const nextIdx = prev + 1;
          const step = steps[nextIdx];
          if (step?.type === 'success') {
            setIsPlaying(false);
            setFoundPaths(curr => {
              if (!curr.some(p => p.path.join() === step.path.join())) {
                return [...curr, { path: step.path, startNodeLabel: step.startNodeLabel }];
              }
              return curr;
            });
          }
          return nextIdx;
        });
      }, speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, speed, steps]);

  const handleNextPath = () => {
    if (currentStepIndex < steps.length - 1) {
      setViewingStaticPath(null);
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (showLogs && logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [currentStepIndex, showLogs]);

  const getLabel = (id) => nodes.find(n => n.id === id)?.label || id;

  let activePath = [];
  let currentActiveNode = null;
  let checkingEdge = null;
  let backtrackedNode = null;

  if (viewingStaticPath) {
    activePath = viewingStaticPath;
    currentActiveNode = viewingStaticPath[viewingStaticPath.length - 1];
  } else if (currentStepIndex >= 0) {
    const currentStep = steps[currentStepIndex];
    activePath = currentStep?.path || [];
    currentActiveNode = currentStep?.current;
    checkingEdge = currentStep?.type === 'check_edge' ? { u: currentStep.current, v: currentStep.next } : null;
    backtrackedNode = currentStep?.type === 'backtrack' ? currentStep.backtracked : null;
  }

  const effectiveStartNodes = getEffectiveStartNodes();
  const isPopping = steps[currentStepIndex]?.type === 'backtrack';
  const isCurrentStepSuccess = steps[currentStepIndex]?.type === 'success';

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">

      {/* HEADER */}
      <header className="bg-slate-950 border-b border-slate-800 p-4 flex flex-row justify-between px-8 items-center shadow-lg z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            <Cpu size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent uppercase tracking-wider">
              Hamilton Simulator
            </h1>
          </div>
        </div>
        <a href="https://trr2.alithw.qzz.io/" className="text-slate-200 hover:text-blue-400 transition border border-slate-700 hover:border-blue-400 px-4 py-1 font-semibold rounded flex items-center gap-1" target="_blank" rel="noopener noreferrer">
          Game
        </a>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* === SIDEBAR TRÁI: XÂY MAP & CHỌN MÀN === */}
        <div style={{ width: leftPanelWidth }} className="border-slate-800 z-10 shrink-0 bg-slate-900 border-r relative select-none">
          <div className="w-full h-full p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">

            {/* Nút Toggle Hamburger Menu */}
            <div className="flex items-center justify-between mb-2 shrink-0 px-1">
              {isSidebarExpanded && <div className="text-[15px] font-bold text-slate-500 uppercase tracking-widest truncate flex-1">Chỉnh sửa Map</div>}
              <button onClick={toggleSidebar} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shrink-0 mx-auto" title="Thu gọn / Mở rộng Menu">
                <Menu size={18} />
              </button>
            </div>

            <ToolBtn isExpanded={isSidebarExpanded} icon={<MousePointer2 />} label="Chọn / Kéo thả" mode="select" current={mode} setMode={setMode} locked={false} />
            <ToolBtn isExpanded={isSidebarExpanded} icon={<PlusCircle />} label="Thêm đỉnh" mode="addNode" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
            <ToolBtn isExpanded={isSidebarExpanded} icon={<GitMerge />} label="Nối cạnh" mode="addEdge" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
            <ToolBtn isExpanded={isSidebarExpanded} icon={<Trash2 />} label="Xóa (Đỉnh/Cạnh)" mode="remove" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
            <ToolBtn isExpanded={isSidebarExpanded} icon={<MapPin />} label="Chọn Gốc" mode="setStart" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath || searchAllNodes} activeColor="text-amber-400" activeBg="bg-amber-500/10 border-amber-500/50" />

            <button onClick={clearMapData} className={`mt-1 flex items-center justify-center ${isSidebarExpanded ? 'md:justify-start px-3' : 'px-0'} gap-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition`}>
              <Trash size={20} className="shrink-0" /> {isSidebarExpanded && <span className="hidden md:inline text-[16px] font-bold truncate">Xóa Trắng</span>}
            </button>

            <div className="h-px bg-slate-800 my-1 mx-1 shrink-0"></div>

            {isSidebarExpanded && <div className="text-[14px] font-bold text-slate-500 uppercase tracking-widest text-center md:text-left mt-1 truncate px-1">Điều chỉnh màn canvas</div>}

            {/* Đã gỡ bỏ hiển thị MAP 1 (ID 1), các MAP sẽ hiển thị bắt đầu từ 2 */}
            <div className={`grid ${isSidebarExpanded ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-2 mb-2 shrink-0 px-1`}>
              {MAP_LEVELS.slice(1).map((lvl, index) => {
                const actualIdx = index + 1; // Vì đã slice mất vị trí 0, nên index + 1 để lấy vị trí thực của mảng
                return (
                  <button
                    key={lvl.id}
                    onClick={() => { loadLevel(lvl); setCurrentLevel(actualIdx); }}
                    title={lvl.name}
                    className={`flex items-center justify-center aspect-square rounded border font-black text-xs transition-all ${currentLevel === actualIdx ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    {actualIdx + 1}
                  </button>
                )
              })}
            </div>

            {/* Các nút Zoom xếp dọc */}
            <div className={`mt-auto ${isSidebarExpanded ? 'flex-row py-2 gap-1' : 'flex-col px-1 gap-3 py-2'} flex justify-around bg-slate-950 rounded-lg border border-slate-800 shrink-0 w-full mx-auto`}>
              <button onClick={() => handleZoom(1.2)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"><ZoomIn size={20} /></button>
              <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"><Maximize size={20} /></button>
              <button onClick={() => handleZoom(0.8)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition flex justify-center"><ZoomOut size={20} /></button>
            </div>
          </div>

          {/* Drag Handle cho thanh menu Trái */}
          {/* <div
            onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingLeft' }); }}
            className="absolute top-0 -right-2 w-4 h-full cursor-col-resize z-30 hover:bg-blue-500/20 transition-colors flex justify-center items-center group"
          >
            <div className="w-1 h-12 bg-slate-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
          </div> */}
        </div>

        {/* === KHU VỰC VẼ CANVAS CHÍNH === */}
        <div
          className="flex-1 relative overflow-hidden bg-slate-950/80 shadow-inner touch-none flex flex-col"
          onPointerMove={onPointerMove}
          onPointerUp={onSvgPointerUp}
          onPointerLeave={onSvgPointerUp}
        >
          {/* Lưới nền Game */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`, backgroundPosition: `${transform.x}px ${transform.y}px` }}></div>

          <svg
            ref={svgRef}
            className={`w-full flex-1 ${mode === 'addNode' ? 'cursor-crosshair' : (interaction.type === 'panning' ? 'cursor-grabbing' : 'cursor-grab')}`}
            onWheel={handleWheel}
            onPointerDown={onSvgPointerDown}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>

              {/* TIA KÉO ĐƯỜNG ĐI (Chế độ Nối Cạnh) */}
              {(interaction.type === 'drawingEdge') && (
                <line
                  x1={nodes.find(n => n.id === interaction.sourceId)?.x} y1={nodes.find(n => n.id === interaction.sourceId)?.y}
                  x2={mouseCoords.x} y2={mouseCoords.y}
                  stroke="#64748b" strokeWidth={3} strokeDasharray="4 4" className="pointer-events-none opacity-60"
                />
              )}

              {/* Vẽ Cạnh */}
              {edges.map(edge => {
                const source = nodes.find(n => n.id === edge.source);
                const target = nodes.find(n => n.id === edge.target);
                if (!source || !target) return null;

                let isPathEdge = false;
                if ((activePath || []).length > 1) {
                  isPathEdge = activePath.some((n, i) => {
                    if (i === 0) return false;
                    const prev = activePath[i - 1];
                    return (prev === source.id && n === target.id) || (prev === target.id && n === source.id);
                  });
                }

                const isCheckingEdge = checkingEdge && ((checkingEdge.u === source.id && checkingEdge.v === target.id) || (checkingEdge.v === source.id && checkingEdge.u === target.id));

                let stroke = "#334155", strokeWidth = 3, strokeDash = "none", classes = "transition-all duration-300";

                if (isPathEdge) {
                  stroke = "#10b981"; strokeWidth = 6;
                } else if (isCheckingEdge) {
                  stroke = "#f59e0b"; strokeWidth = 4; strokeDash = "6,4"; classes += " animate-[dash_1s_linear_infinite]";
                } else if (mode === 'remove' && currentStepIndex < 0 && !viewingStaticPath) {
                  classes += " hover:stroke-red-500 hover:stroke-[8px] cursor-pointer";
                }

                return (
                  <line
                    key={edge.id} x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                    stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={strokeDash}
                    className={classes} onPointerDown={(e) => onEdgePointerDown(e, edge.id)}
                  />
                );
              })}

              {/* Vẽ mũi tên hướng đi trên ActivePath */}
              {(activePath || []).length > 1 && activePath.map((nodeId, idx) => {
                if (idx === 0) return null;
                const prevNode = nodes.find(n => n.id === activePath[idx - 1]);
                const currNode = nodes.find(n => n.id === nodeId);
                if (!prevNode || !currNode) return null;

                const midX = (prevNode.x + currNode.x) / 2, midY = (prevNode.y + currNode.y) / 2;
                const angle = Math.atan2(currNode.y - prevNode.y, currNode.x - prevNode.x) * (180 / Math.PI);

                return (
                  <g key={`arrow-${idx}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`} className="pointer-events-none transition-all duration-300 drop-shadow-lg">
                    <polygon points="-10,-8 10,0 -10,8" fill="#d1fae5" />
                  </g>
                );
              })}

              {/* Vẽ Đỉnh */}
              {nodes.map(node => {
                const isStart = effectiveStartNodes.includes(node.id) && currentStepIndex < 0 && !viewingStaticPath;
                const isInPath = (activePath || []).includes(node.id);
                const isCurrent = currentActiveNode === node.id;
                const isBacktracked = backtrackedNode === node.id;

                let fill = "#1e293b", stroke = "#475569", strokeW = 2, radius = 24, zIndexClass = "", strokeDash = "none";

                if (isCurrent) {
                  fill = "#f59e0b"; stroke = "#fbbf24"; strokeW = 4; radius = 28; zIndexClass = `drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]`;
                } else if (isInPath) {
                  fill = "#10b981"; stroke = "#34d399"; strokeW = 3;
                } else if (isBacktracked) {
                  fill = "#ef4444"; stroke = "#f87171"; strokeW = 2; zIndexClass = "animate-[shake_0.5s_ease-in-out]";
                } else if (isStart) {
                  stroke = "#6366f1"; strokeW = 4;
                }

                const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;
                let interactiveClasses = '';

                if (!isAlgorithmActive) {
                  interactiveClasses = mode === 'remove' ? 'hover:stroke-red-500 hover:fill-red-900 cursor-pointer' :
                    mode === 'addEdge' ? 'hover:stroke-indigo-400 hover:fill-indigo-900 cursor-pointer' :
                      (mode === 'setStart' || mode === 'select') ? 'hover:stroke-emerald-400 cursor-pointer cursor-grab active:cursor-grabbing' : 'cursor-grab active:cursor-grabbing';
                } else {
                  // Luôn cho phép nắm kéo thả đỉnh dù đang chạy
                  interactiveClasses = 'cursor-grab active:cursor-grabbing hover:stroke-amber-400';
                }

                return (
                  <g
                    key={node.id} transform={`translate(${node.x}, ${node.y})`}
                    onPointerDown={(e) => onNodePointerDown(e, node.id)}
                    onPointerUp={(e) => onNodePointerUp(e, node.id)}
                    className={`transition-all duration-300 ${interactiveClasses} ${zIndexClass}`}
                  >
                    <circle r={radius} fill={fill} stroke={stroke} strokeWidth={strokeW} strokeDasharray={strokeDash} className="transition-all duration-300" />
                    <text textAnchor="middle" dominantBaseline="central" fill="#f8fafc" className="font-bold select-none pointer-events-none text-sm">{node.label}</text>
                    {isStart && <text y={-35} textAnchor="middle" className={`text-[10px] font-black fill-indigo-400 pointer-events-none`}>GỐC</text>}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* CONSOLE LOG BÊN DƯỚI CANVAS (Resizable) */}
          {showLogs && (
            <div style={{ height: logHeight }} className="border-t border-slate-800 bg-slate-950 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.5)] relative z-20 shrink-0">

              {/* Drag Handle cho System Log */}
              <div
                onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingLog' }); }}
                className="absolute top-0 left-0 w-full h-2.5 cursor-ns-resize z-30 hover:bg-blue-500/50 transition-colors flex justify-center items-center group"
              >
                <GripHorizontal size={16} className="text-slate-500 opacity-30 group-hover:opacity-100" />
              </div>

              <div className="px-3 py-1.5 mt-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-sm text-slate-400 shrink-0">
                <span className="flex items-center gap-1 font-bold"><Terminal size={20} /> SYSTEM LOG (Tiến trình duyệt)</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1">
                {steps.slice(0, currentStepIndex + 1).map((s, i) => (
                  <div key={i} className={`
                     ${s.type === 'visit' ? 'text-emerald-400' : ''}
                     ${s.type === 'backtrack' ? 'text-red-400 line-through opacity-80' : ''}
                     ${s.type === 'check_edge' ? 'text-amber-300' : ''}
                     ${s.type === 'skip' ? 'text-slate-500' : ''}
                     ${s.type === 'deadend' ? 'text-orange-500 bg-orange-500/10 inline-block px-1 rounded' : ''}
                     ${s.type === 'success' ? 'text-white font-bold bg-emerald-600 px-2 py-1 rounded inline-block my-1' : ''}
                     ${s.type === 'info' ? 'text-blue-300' : ''}
                     ${s.type === 'finish' ? 'text-fuchsia-400 font-bold text-sm mt-2' : ''}
                   `}>
                    <span className="opacity-50 select-none mr-2">[{String(i).padStart(3, '0')}]</span>
                    {s.action}
                  </div>
                ))}
                {currentStepIndex < 0 && <div className="text-slate-600 italic text-lg">Đang chờ lệnh chạy thuật toán...</div>}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* POPUP: KẾT QUẢ TÌM SIÊU TỐC */}
          {showFastResultsModal && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-50 flex flex-col p-8">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                  <Zap size={28} /> Kết quả Tìm Siêu Tốc ({fastResults.length})
                </h2>
                <button onClick={() => setShowFastResultsModal(false)} className="p-2 bg-slate-800 hover:bg-red-500 text-white rounded transition"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
                {fastResults.length === 0 ? (
                  <div className="col-span-full text-center text-slate-500 py-10">Không tìm thấy đường đi Hamilton nào trên bản đồ này!</div>
                ) : (
                  fastResults.map((path, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setViewingStaticPath(path.path); setShowFastResultsModal(false); }}
                      className="p-3 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-400 rounded-lg text-left transition-all group"
                    >
                      <div className="text-xs text-slate-400 mb-1 group-hover:text-indigo-200">Đường đi {idx + 1} (đỉnh {path.startNodeLabel})</div>
                      <div className="font-mono text-sm text-white flex flex-wrap items-center gap-1">
                        {path.path.map((n, i) => (
                          <React.Fragment key={i}>
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">{getLabel(n)}</span>
                            {i < path.path.length - 1 && <ChevronRight size={12} className="opacity-50" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* === SIDEBAR PHẢI: BẢNG ĐIỀU KHIỂN & STACK === */}
        <div style={{ width: rightPanelWidth }} className="border-slate-800 z-20 shrink-0 bg-slate-900 shadow-2xl border-l relative select-none">

          {/* Drag Handle cho thanh menu Phải */}
          <div
            onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingRight' }); }}
            className="absolute top-0 -left-2 w-4 h-full cursor-col-resize z-30 hover:bg-blue-500/20 transition-colors flex justify-center items-center group"
          >
            <div className="w-1 h-12 bg-slate-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
          </div>

          <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 shrink-0">
              {/* Header Control Panel */}
              <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-2">
                  <Cpu size={16} className="text-blue-400" /> Bộ điều khiển
                </h2>
                <button onClick={resetVisualizer} className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-200 border border-slate-700 hover:border-red-500/50 rounded text-sm font-bold flex items-center gap-1 transition">
                  <RotateCcw size={14} /> Reset Trạng Thái
                </button>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer bg-slate-900 p-2 rounded border border-slate-700 hover:bg-slate-800 transition">
                  <input type="checkbox" checked={searchAllNodes} onChange={(e) => { setSearchAllNodes(e.target.checked); resetVisualizer(); }} className="accent-blue-500 w-4 h-4" />
                  <span>Tìm trên <b>Mọi đỉnh</b> thay vì Gốc</span>
                </label>

                <button onClick={runFastGlobalSearch} className="w-full bg-slate-800 hover:bg-blue-600 text-blue-300 hover:text-white py-2 rounded border border-slate-700 hover:border-blue-400 text-sm font-bold flex items-center justify-center gap-2 transition">
                  <Zap size={16} /> Tìm siêu tốc (Xuất List Kết quả)
                </button>
              </div>

              {/* Khối Button điều khiển Visualize */}
              <div className="flex gap-2 mb-4">
                {currentStepIndex < 0 ? (
                  <button onClick={generateSteps} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <Play size={18} fill="currentColor" /> CHẠY BACKTRACK
                  </button>
                ) : isCurrentStepSuccess ? (
                  <button onClick={handleNextPath} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
                    <MapIcon size={18} /> TÌM ĐƯỜNG TIẾP
                  </button>
                ) : (
                  <>
                    <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStepIndex >= steps.length - 1} className={`flex-1 ${isPlaying ? 'bg-rose-600' : 'bg-blue-600'} text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 transition disabled:opacity-50`}>
                      {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    </button>
                    <button onClick={() => { setIsPlaying(false); setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1)); }} disabled={isPlaying} className="w-16 bg-slate-800 py-2 rounded flex justify-center text-slate-300 hover:bg-slate-700 disabled:opacity-50 transition">
                      <SkipForward size={18} />
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400">Chậm</span>
                <input type="range" min="100" max="1500" step="100" value={1600 - speed} onChange={(e) => setSpeed(1600 - Number(e.target.value))} className="flex-1 accent-blue-500 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                <span className="text-xs font-medium text-slate-400">Nhanh</span>

                <button onClick={() => setShowLogs(!showLogs)} className={`p-1.5 ml-2 rounded transition text-xs flex items-center justify-center ${showLogs ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'}`} title="Bật/Tắt Log Tiến trình">
                  {showLogs ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Stack Trực Quan Hóa (Với hiệu ứng Push Down / Pop Up) */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 p-4 overflow-y-auto relative">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><GitMerge size={14} /> Stack Trực Quan</h3>
                {viewingStaticPath ? (
                  <div className="text-emerald-400 text-sm p-4 bg-emerald-500/10 border border-emerald-500/30 rounded text-center font-medium">
                    Đang xem lại Kết quả.<br />Hãy bấm "Reset Trạng Thái" để tắt xem lại và bắt đầu tìm kiếm mới.
                  </div>
                ) : (
                  <div className="relative pt-2">
                    {(activePath || []).length === 0 && !isPopping && <div className="text-slate-600 text-sm italic text-center py-4 border border-dashed border-slate-700 rounded">Stack trống</div>}

                    {/* Node bị Pop ra sẽ hiện trên cùng, lướt lên trên và biến mất */}
                    {isPopping && backtrackedNode && (
                      <div key={`pop-${currentStepIndex}`} className="absolute top-2 left-0 w-full flex items-center gap-3 animate-[slideUpOut_0.5s_ease-out_forwards] z-10 h-12">
                        <div className="w-6 text-right text-xs text-slate-500 font-mono">#{activePath.length + 1}</div>
                        <div className="flex-1 bg-red-500/10 border border-red-500/30 rounded p-2 flex items-center gap-3 shadow-sm h-full box-border">
                          <div className="w-6 h-6 rounded bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center font-bold text-xs">{getLabel(backtrackedNode)}</div>
                          <span className="text-sm text-red-300">Pop (Xóa khỏi Stack)</span>
                        </div>
                      </div>
                    )}

                    {/* Các Node hiện tại trong Stack đẩy xuống dần */}
                    <div className={`flex flex-col gap-2 transition-all duration-500 ${isPopping ? 'translate-y-14' : 'translate-y-0'}`}>
                      {(activePath || []).slice().reverse().map((nodeId, idx) => {
                        const actualStackIndex = activePath.length - 1 - idx;
                        const isNewest = !isPopping && idx === 0;
                        return (
                          <div key={`stack-${nodeId}-${actualStackIndex}`} className={`flex items-center gap-3 h-12 ${isNewest ? 'animate-[slideDownIn_0.3s_ease-out_forwards]' : ''}`}>
                            <div className="w-6 text-right text-xs text-slate-500 font-mono">#{actualStackIndex + 1}</div>
                            <div className="flex-1 bg-slate-800 border border-slate-700 rounded p-2 flex items-center gap-3 shadow-sm h-full box-border">
                              <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/50 text-blue-400 flex items-center justify-center font-bold text-xs">{getLabel(nodeId)}</div>
                              <span className="text-sm text-slate-300">Nằm trong Stack</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bảng Lịch Sử Kết Quả (Nằm dưới Stack) */}
              <div className={`border-t border-slate-800 bg-slate-900 flex flex-col transition-all duration-300 shrink-0 ${showResultsHistory ? 'h-56' : 'h-10'}`}>
                <button onClick={() => setShowResultsHistory(!showResultsHistory)} className="px-4 py-2.5 bg-slate-950 flex justify-between items-center text-sm font-bold text-slate-400 hover:text-white transition cursor-pointer">
                  <span className="flex items-center gap-2"><List size={14} /> Kết Quả Đã Tìm Thấy ({foundPaths.length})</span>
                  {showResultsHistory ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>

                {showResultsHistory && (
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-900">
                    {foundPaths.length === 0 ? (
                      <div className="text-center text-sm text-slate-600 py-4 italic">Chưa tìm thấy đường đi nào...</div>
                    ) : (
                      foundPaths.map((s, i) => {
                        const isActive = viewingStaticPath === s.path;
                        return (
                          <button
                            key={i}
                            onClick={() => setViewingStaticPath(s.path)}
                            className={`w-full text-left text-xs p-2 rounded transition-all border ${isActive ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`}
                          >
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

      <style>{`
        @keyframes dash { to { stroke-dashoffset: -10; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-3px, 0); } 75% { transform: translate(3px, 0); } }
        
        /* Hiệu ứng Đẩy hộp từ trên xuống (Push) */
        @keyframes slideDownIn { 
           0% { opacity: 0; transform: translateY(-56px); } 
           100% { opacity: 1; transform: translateY(0); } 
        }
        /* Hiệu ứng Đẩy hộp lên trên và biến mất (Pop/Xóa) */
        @keyframes slideUpOut { 
           0% { opacity: 1; transform: translateY(0); } 
           100% { opacity: 0; transform: translateY(-56px); } 
        }
      `}</style>
    </div>
  );
}

function ToolBtn({ icon, label, mode, current, setMode, locked, activeColor = "text-blue-400", activeBg = "bg-blue-500/10 border-blue-500/50", isExpanded }) {
  const isActive = mode === current;
  return (
    <button
      onClick={() => setMode(mode)} disabled={locked} title={label}
      className={`w-full flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center px-0'} gap-3 py-2.5 rounded border transition-all ${locked ? 'opacity-30 cursor-not-allowed border-transparent' : 'cursor-pointer hover:bg-slate-800'
        } ${isActive ? activeBg + ' ' + activeColor : 'border-transparent text-slate-400'
        }`}
    >
      <span className={`shrink-0 ${isActive ? "" : "opacity-70"}`}>{React.cloneElement(icon, { size: 18 })}</span>
      {isExpanded && <span className="text-[16px] font-medium flex-1 truncate text-left">{label}</span>}
    </button>
  );
}