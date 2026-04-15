import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, SkipForward, RotateCcw,
  MousePointer2, PlusCircle, GitMerge, Trash2,
  MapPin, Trash, Cpu, ChevronRight,
  ZoomIn, ZoomOut, Maximize, Zap, List,
  Eye, EyeOff, Terminal, ChevronDown, ChevronUp, Map as MapIcon, X, GripHorizontal, Menu,
  Sun, Moon, Settings2, Gamepad2, RefreshCw
} from 'lucide-react';

const STORAGE_KEY = 'hamiltonian_map_save_v7';
const THEME_KEY = 'hamiltonian_theme_mode';

// --- DANH SÁCH MÀN CHƠI (LEVELS) ---
const MAP_LEVELS = [
  {
    id: 1, name: "Ngôi nhà nhỏ",
    nodes: [{ id: 'n1', x: 300, y: 150, label: '1' }, { id: 'n2', x: 200, y: 250, label: '2' }, { id: 'n3', x: 400, y: 250, label: '3' }, { id: 'n4', x: 200, y: 400, label: '4' }, { id: 'n5', x: 400, y: 400, label: '5' }],
    edges: [{ id: 'e1', source: 'n1', target: 'n2' }, { id: 'e2', source: 'n1', target: 'n3' }, { id: 'e3', source: 'n2', target: 'n3' }, { id: 'e4', source: 'n2', target: 'n4' }, { id: 'e5', source: 'n3', target: 'n5' }, { id: 'e6', source: 'n4', target: 'n5' }]
  },
  {
    id: 2, name: "Viên kim cương",
    nodes: [{ id: 'n1', x: 300, y: 150, label: '1' }, { id: 'n2', x: 200, y: 250, label: '2' }, { id: 'n3', x: 400, y: 250, label: '3' }, { id: 'n4', x: 300, y: 350, label: '4' }],
    edges: [{ source: 'n1', target: 'n2', id: 'e1' }, { source: 'n1', target: 'n3', id: 'e2' }, { source: 'n2', target: 'n4', id: 'e3' }, { source: 'n3', target: 'n4', id: 'e4' }, { source: 'n2', target: 'n3', id: 'e5' }]
  },
  {
    id: 3, name: "Con bướm",
    nodes: [{ id: 'n1', x: 200, y: 150, label: '1' }, { id: 'n2', x: 200, y: 350, label: '2' }, { id: 'n3', x: 300, y: 250, label: '3' }, { id: 'n4', x: 400, y: 150, label: '4' }, { id: 'n5', x: 400, y: 350, label: '5' }],
    edges: [{ source: 'n1', target: 'n2', id: 'e1' }, { source: 'n1', target: 'n3', id: 'e2' }, { source: 'n2', target: 'n3', id: 'e3' }, { source: 'n3', target: 'n4', id: 'e4' }, { source: 'n3', target: 'n5', id: 'e5' }, { source: 'n4', target: 'n5', id: 'e6' }]
  },
  {
    id: 4, name: "Lục giác chéo",
    nodes: [{ id: 'n1', x: 300, y: 100, label: '1' }, { id: 'n2', x: 430, y: 175, label: '2' }, { id: 'n3', x: 430, y: 325, label: '3' }, { id: 'n4', x: 300, y: 400, label: '4' }, { id: 'n5', x: 170, y: 325, label: '5' }, { id: 'n6', x: 170, y: 175, label: '6' }],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n1',id:'e6'},{source:'n1',target:'n4',id:'e7'},{source:'n2',target:'n5',id:'e8'},{source:'n3',target:'n6',id:'e9'}]
  },
  {
    id: 5, name: "Bánh xe",
    nodes: [{ id: 'n1', x: 300, y: 250, label: '1' }, { id: 'n2', x: 300, y: 100, label: '2' }, { id: 'n3', x: 440, y: 150, label: '3' }, { id: 'n4', x: 380, y: 350, label: '4' }, { id: 'n5', x: 220, y: 350, label: '5' }, { id: 'n6', x: 160, y: 150, label: '6' }],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n1',target:'n3',id:'e2'},{source:'n1',target:'n4',id:'e3'},{source:'n1',target:'n5',id:'e4'},{source:'n1',target:'n6',id:'e5'},{source:'n2',target:'n3',id:'e6'},{source:'n3',target:'n4',id:'e7'},{source:'n4',target:'n5',id:'e8'},{source:'n5',target:'n6',id:'e9'},{source:'n6',target:'n2',id:'e10'}]
  },
  {
    id: 6, name: "Khối lập phương",
    nodes: [{ id: 'n1', x: 200, y: 200, label: '1' }, { id: 'n2', x: 300, y: 200, label: '2' }, { id: 'n3', x: 300, y: 300, label: '3' }, { id: 'n4', x: 200, y: 300, label: '4' }, { id: 'n5', x: 250, y: 150, label: '5' }, { id: 'n6', x: 350, y: 150, label: '6' }, { id: 'n7', x: 350, y: 250, label: '7' }, { id: 'n8', x: 250, y: 250, label: '8' }],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n1',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n7',id:'e6'},{source:'n7',target:'n8',id:'e7'},{source:'n8',target:'n5',id:'e8'},{source:'n1',target:'n5',id:'e9'},{source:'n2',target:'n6',id:'e10'},{source:'n3',target:'n7',id:'e11'},{source:'n4',target:'n8',id:'e12'}]
  },
  {
    id: 7, name: "Bát giác chéo",
    nodes: [{id: 'n1', x: 300, y: 100, label: '1'}, {id: 'n2', x: 440, y: 160, label: '2'}, {id: 'n3', x: 500, y: 300, label: '3'}, {id: 'n4', x: 440, y: 440, label: '4'}, {id: 'n5', x: 300, y: 500, label: '5'}, {id: 'n6', x: 160, y: 440, label: '6'}, {id: 'n7', x: 100, y: 300, label: '7'}, {id: 'n8', x: 160, y: 160, label: '8'}],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n6',id:'e5'},{source:'n6',target:'n7',id:'e6'},{source:'n7',target:'n8',id:'e7'},{source:'n8',target:'n1',id:'e8'},{source:'n1',target:'n5',id:'e9'},{source:'n2',target:'n6',id:'e10'},{source:'n3',target:'n7',id:'e11'},{source:'n4',target:'n8',id:'e12'}]
  },
  {
    id: 8, name: "Đồ thị Petersen",
    nodes: [{ id: 'n1', x: 300, y: 100, label: '1' }, { id: 'n2', x: 490, y: 240, label: '2' }, { id: 'n3', x: 420, y: 450, label: '3' }, { id: 'n4', x: 180, y: 450, label: '4' }, { id: 'n5', x: 110, y: 240, label: '5' }, { id: 'n6', x: 300, y: 200, label: '6' }, { id: 'n7', x: 395, y: 270, label: '7' }, { id: 'n8', x: 360, y: 375, label: '8' }, { id: 'n9', x: 240, y: 375, label: '9' }, { id: 'n10', x: 205, y: 270, label: '10' }],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n4',target:'n5',id:'e4'},{source:'n5',target:'n1',id:'e5'},{source:'n6',target:'n8',id:'e6'},{source:'n8',target:'n10',id:'e7'},{source:'n10',target:'n7',id:'e8'},{source:'n7',target:'n9',id:'e9'},{source:'n9',target:'n6',id:'e10'},{source:'n1',target:'n6',id:'e11'},{source:'n2',target:'n7',id:'e12'},{source:'n3',target:'n8',id:'e13'},{source:'n4',target:'n9',id:'e14'},{source:'n5',target:'n10',id:'e15'}]
  },
  {
    id: 9, name: "Lưới 3x4",
    nodes: [{ id: 'n1', x: 150, y: 150, label: '1' }, { id: 'n2', x: 250, y: 150, label: '2' }, { id: 'n3', x: 350, y: 150, label: '3' }, { id: 'n4', x: 450, y: 150, label: '4' }, { id: 'n5', x: 150, y: 250, label: '5' }, { id: 'n6', x: 250, y: 250, label: '6' }, { id: 'n7', x: 350, y: 250, label: '7' }, { id: 'n8', x: 450, y: 250, label: '8' }, { id: 'n9', x: 150, y: 350, label: '9' }, { id: 'n10', x: 250, y: 350, label: '10' }, { id: 'n11', x: 350, y: 350, label: '11' }, { id: 'n12', x: 450, y: 350, label: '12' }],
    edges: [{source:'n1',target:'n2',id:'e1'},{source:'n2',target:'n3',id:'e2'},{source:'n3',target:'n4',id:'e3'},{source:'n5',target:'n6',id:'e4'},{source:'n6',target:'n7',id:'e5'},{source:'n7',target:'n8',id:'e6'},{source:'n9',target:'n10',id:'e7'},{source:'n10',target:'n11',id:'e8'},{source:'n11',target:'n12',id:'e9'},{source:'n1',target:'n5',id:'e10'},{source:'n5',target:'n9',id:'e11'},{source:'n2',target:'n6',id:'e12'},{source:'n6',target:'n10',id:'e13'},{source:'n3',target:'n7',id:'e14'},{source:'n7',target:'n11',id:'e15'},{source:'n4',target:'n8',id:'e16'},{source:'n8',target:'n12',id:'e17'}]
  }
];

export default function App() {
  // --- THEME & RESPONSIVE STATE ---
  const [theme, setTheme] = useState('dark');
  const [showMobileLeft, setShowMobileLeft] = useState(false);
  const [showMobileRight, setShowMobileRight] = useState(false);
  const isDark = theme === 'dark';

  // --- CUSTOM TOAST NOTIFICATION ---
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const [currentLevel, setCurrentLevel] = useState(0); // number hoặc 'custom'
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

  // State quản lý việc bấm chọn 2 điểm trên màn hình điện thoại (Tap to connect)
  const [pendingEdgeSource, setPendingEdgeSource] = useState(null);
  
  // State quản lý mảng đường đi tự chọn trong Game Mode
  const [gamePath, setGamePath] = useState([]);
  const didStartNewPath = useRef(false); // Đánh dấu nếu đường đi gamePath vừa mới bắt đầu

  // Sidebar Widths & Toggle
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(208); // Mặc định ~208px
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

  // --- MULTI-TOUCH ZOOM REFS ---
  const pinchDistanceRef = useRef(null);
  const isPinching = useRef(false);

  // Khởi tạo Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    }
  }, []);

  // Đồng bộ class 'dark' lên thẻ <html> và quét sạch các thẻ cha để ép ghi đè môi trường preview
  useEffect(() => {
    const wrapper = document.getElementById('hamilton-app-wrapper');

    const syncTheme = () => {
      const elementsToUpdate = new Set([document.documentElement, document.body]);

      // Môi trường Canvas thường bọc code trong <div id="root" class="dark">
      // Mình cần quét ngược lên và gỡ bỏ triệt để class 'dark' khỏi TẤT CẢ các thẻ cha
      let current = wrapper?.parentElement;
      while (current) {
        elementsToUpdate.add(current);
        current = current.parentElement;
      }

      elementsToUpdate.forEach(el => {
        if (el && el.classList) {
          if (isDark) {
            el.classList.add('dark');
          } else {
            el.classList.remove('dark');
          }
        }
      });
    };

    syncTheme();

    // Khóa chặt theme: Dùng MutationObserver để canh chừng nếu hệ thống bên ngoài ép thêm class dark trở lại
    const observer = new MutationObserver(() => {
      syncTheme();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    if (wrapper?.parentElement) {
      observer.observe(wrapper.parentElement, { attributes: true, attributeFilter: ['class'] });
    }

    return () => observer.disconnect();
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  // Hủy đỉnh đang chọn dở / reset game path nếu đổi công cụ (ví dụ từ Nối Cạnh sang Xóa)
  useEffect(() => {
    setPendingEdgeSource(null);
    if (mode !== 'play') {
      setGamePath([]);
    }
  }, [mode]);

  const pushHistory = (skipCustom = false) => {
    setPast(prev => [...prev, {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      startNode,
      nextNodeId,
      nextEdgeId
    }]);
    if (!skipCustom) {
      setCurrentLevel('custom');
    }
  };

  const handleUndo = () => {
    setPast(prevPast => {
      if (prevPast.length === 0) return prevPast;
      const previousState = prevPast[prevPast.length - 1];

      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setStartNode(previousState.startNode);
      setNextNodeId(previousState.nextNodeId);
      setNextEdgeId(previousState.nextEdgeId);

      setCurrentLevel('custom');
      return prevPast.slice(0, -1);
    });
  };

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
        setCurrentLevel(data.currentLevel !== undefined ? data.currentLevel : 'custom');
      } catch (e) {
        loadLevel(MAP_LEVELS[0], 0);
      }
    } else {
      loadLevel(MAP_LEVELS[0], 0);
    }
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || currentLevel === 'custom') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges, startNode, currentLevel }));
    }
  }, [nodes, edges, startNode, currentLevel]);

  useEffect(() => {
    if (interaction.type !== 'resizingLog' && interaction.type !== 'resizingLeft' && interaction.type !== 'resizingRight') return;

    const handlePointerMove = (e) => {
      if (interaction.type === 'resizingLog') {
        const newHeight = window.innerHeight - e.clientY;
        setLogHeight(Math.max(60, Math.min(newHeight, window.innerHeight * 0.8)));
      } else if (window.innerWidth >= 768) {
        // Chỉ cho phép resize 2 Sidebar 2 bên trên Desktop
        if (interaction.type === 'resizingLeft') {
          const newWidth = Math.max(64, Math.min(e.clientX, window.innerWidth * 0.4));
          setLeftPanelWidth(newWidth);
          setIsSidebarExpanded(newWidth > 100);
        } else if (interaction.type === 'resizingRight') {
          const newWidth = window.innerWidth - e.clientX;
          setRightPanelWidth(Math.max(200, Math.min(newWidth, window.innerWidth * 0.5)));
        }
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

  // Kiểm tra thắng game (đi qua mọi đỉnh) & Lưu kết quả tự động
  useEffect(() => {
    if (mode === 'play' && nodes.length > 0 && gamePath.length === nodes.length) {
      const pathString = gamePath.join(',');
      const alreadyFound = foundPaths.some(p => p.path.join(',') === pathString);
      
      if (!alreadyFound) {
        const startLabel = nodes.find(n => n.id === gamePath[0])?.label || gamePath[0];
        setFoundPaths(curr => [...curr, { path: [...gamePath], startNodeLabel: startLabel }]);
        setShowResultsHistory(true); // Mở sẵn bảng kết quả để xem
        showToast('🎉 CHÚC MỪNG BẠN ĐÃ TÌM ĐƯỢC ĐƯỜNG ĐI! 🎉\nKết quả đã được tự động lưu lại.');
      }
    }
  }, [gamePath, mode, nodes, foundPaths]);

  const toggleSidebar = () => {
    if (isSidebarExpanded) {
      setLeftPanelWidth(64);
      setIsSidebarExpanded(false);
    } else {
      setLeftPanelWidth(208);
      setIsSidebarExpanded(true);
    }
  };

  const loadLevel = (lvl, index) => {
    pushHistory(true); // pass true to skip marking as custom
    setNodes(lvl.nodes);
    setEdges(lvl.edges);
    setStartNode(null);
    resetVisualizer();
    setNextNodeId(Math.max(0, ...lvl.nodes.map(n => parseInt(n.id.replace(/\D/g, '')) || 0)) + 1);
    setNextEdgeId(Math.max(0, ...lvl.edges.map(e => parseInt(e.id.replace(/\D/g, '')) || 0)) + 1);
    setCurrentLevel(index);
    if (window.innerWidth < 768) setShowMobileLeft(false);
  };

  const resetCurrentMap = () => {
    if (currentLevel === 'custom') {
      pushHistory();
      setNodes([]); setEdges([]); setStartNode(null);
      resetVisualizer();
      showToast("Đã xóa trắng bản đồ tùy chỉnh!");
    } else {
      loadLevel(MAP_LEVELS[currentLevel], currentLevel);
      showToast(`Đã reset màn chơi: ${MAP_LEVELS[currentLevel].name}`);
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

  // Helper hàm tạo cạnh để dùng cho cả Touch và Mouse
  const createEdgeBetween = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    const exists = edges.some(edge => (edge.source === sourceId && edge.target === targetId) || (edge.target === sourceId && edge.source === targetId));
    if (!exists) {
      pushHistory();
      setEdges([...edges, { id: `e${nextEdgeId}`, source: sourceId, target: targetId }]);
      setNextEdgeId(prev => prev + 1);
    }
  };

  // Helper cho việc Kéo Liền Mạch trong lúc chơi Game (Seamless drag)
  const handleGamePathMove = (targetId) => {
    setGamePath(prevPath => {
      if (prevPath.length === 0) return [targetId];
      const lastNode = prevPath[prevPath.length - 1];
      if (lastNode === targetId) return prevPath; // Đang lướt trên cùng 1 đỉnh

      // Lùi lại (Undo) nếu rê trúng đỉnh ngay trước đó
      if (prevPath.length > 1 && prevPath[prevPath.length - 2] === targetId) {
        return prevPath.slice(0, -1);
      }

      // Tới trước (Tiến) nếu đỉnh này kề với đỉnh cuối và chưa đi qua
      if (!prevPath.includes(targetId)) {
        const edgeExists = edges.some(edge => 
          (edge.source === lastNode && edge.target === targetId) || 
          (edge.target === lastNode && edge.source === targetId)
        );
        if (edgeExists) {
          return [...prevPath, targetId];
        }
      }
      return prevPath;
    });
  };

  const onSvgPointerDown = (e) => {
    setIsClick(true);
    // LUÔN CHO PHÉP kéo không gian (Pan) nếu chạm vào vùng trống (background)
    // Giúp thân thiện cho thao tác vuốt trên điện thoại
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    setInteraction({ type: 'panning', startX: clientX - transform.x, startY: clientY - transform.y });
  };

  const onNodePointerDown = (e, nodeId) => {
    e.stopPropagation(); // Nếu chạm vào đỉnh, ngừng sự kiện để không Pan màn hình
    setIsClick(true);
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    if (isAlgorithmActive) {
      setInteraction({ type: 'none' }); // Vô hiệu hóa kéo đỉnh
      return;
    }

    if (mode === 'addEdge') {
      setInteraction({ type: 'drawingEdge', sourceId: nodeId });
      setMouseCoords(getSvgCoords(e));
    } else if (mode === 'remove' || mode === 'setStart') {
      // Do nothing on down
    } else if (mode === 'play') {
      setInteraction({ type: 'playingGamePath' });
      
      // Xử lý khởi tạo / nối điểm / bấm rời rạc
      if (gamePath.length === 0) {
        setGamePath([nodeId]);
        didStartNewPath.current = true;
      } else {
        const lastNode = gamePath[gamePath.length - 1];
        if (lastNode === nodeId) {
          didStartNewPath.current = false;
        } else if (!gamePath.includes(nodeId)) {
          // Bấm trúng đỉnh mới kề -> Nối liền
          const edgeExists = edges.some(edge => 
            (edge.source === lastNode && edge.target === nodeId) || 
            (edge.target === lastNode && edge.source === nodeId)
          );
          if (edgeExists) {
            setGamePath([...gamePath, nodeId]);
            didStartNewPath.current = true;
          } else {
            // Không kề -> Chuyển gốc bắt đầu sang đây
            setGamePath([nodeId]);
            didStartNewPath.current = true;
          }
        } else {
          // Bấm trúng đỉnh đã đi qua -> Reset từ đây
          setGamePath([nodeId]);
          didStartNewPath.current = true;
        }
      }
    } else {
      pushHistory();
      setInteraction({ type: 'draggingNode', nodeId });
    }
  };

  const onEdgePointerDown = (e, edgeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;
    if (isAlgorithmActive || mode === 'play') return;

    if (mode === 'remove') {
      pushHistory();
      setEdges(edges.filter(edge => edge.id !== edgeId));
    }
  };

  const onPointerMove = (e) => {
    if (isPinching.current) return; // Không thực hiện kéo không gian nếu đang Zoom 2 ngón tay

    setIsClick(false);
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    if (interaction.type === 'playingGamePath') {
      // Kiểm tra xem tọa độ con trỏ đang nằm trên đỉnh nào (Seamless Dragging)
      const elem = document.elementFromPoint(clientX, clientY);
      const targetNode = elem?.closest('[data-nodeid]');
      if (targetNode) {
        const targetId = targetNode.getAttribute('data-nodeid');
        if (targetId) handleGamePathMove(targetId);
      }
    } else if (interaction.type === 'panning') {
      setTransform(prev => ({ ...prev, x: clientX - interaction.startX, y: clientY - interaction.startY }));
    } else if (interaction.type === 'draggingNode') {
      const coords = getSvgCoords(e);
      setNodes(nodes.map(n => n.id === interaction.nodeId ? { ...n, x: coords.x, y: coords.y } : n));
    } else if (interaction.type === 'drawingEdge') {
      setMouseCoords(getSvgCoords(e));
    }
  };

  const onSvgPointerUp = (e) => {
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    // Thêm Node nếu chạm không gian ở chế độ addNode
    if (isClick && mode === 'addNode' && !isAlgorithmActive) {
      pushHistory();
      const coords = getSvgCoords(e);
      setNodes([...nodes, { id: `n${nextNodeId}`, x: coords.x, y: coords.y, label: `${nextNodeId}` }]);
      setNextNodeId(prev => prev + 1);
    }

    // Hủy trạng thái nối đỉnh nếu bấm ra ngoài không gian
    if (interaction.type === 'drawingEdge') {
      setPendingEdgeSource(null);
    }

    if (interaction.type !== 'resizingLog') {
      setInteraction({ type: 'none' });
    }
  };

  const onNodePointerUp = (e, nodeId) => {
    e.stopPropagation();
    const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;

    if (isAlgorithmActive) {
      setInteraction({ type: 'none' });
      return;
    }

    if (mode === 'play') {
      if (isClick && gamePath.length > 0) {
        const lastNode = gamePath[gamePath.length - 1];
        // Nếu vừa chạm nhẹ (click) lại vào đỉnh cuối cùng đã đi qua -> Undo (lùi lại 1 bước)
        if (lastNode === nodeId && !didStartNewPath.current) {
          setGamePath(gamePath.slice(0, -1));
        }
      }
      setInteraction({ type: 'none' });
      return;
    }

    if (mode === 'addEdge') {
      if (!isClick && interaction.type === 'drawingEdge') {
        // [CÁCH 1]: Nhả tay sau khi kéo thả (Hỗ trợ tốt cảm ứng Touch trên mobile)
        const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
        const clientY = e.clientY ?? (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
        if (clientX && clientY) {
          // Lấy element ở vị trí nhả tay
          const elem = document.elementFromPoint(clientX, clientY);
          const targetNode = elem?.closest('[data-nodeid]');
          if (targetNode) {
            const targetId = targetNode.getAttribute('data-nodeid');
            if (targetId && targetId !== interaction.sourceId) {
              createEdgeBetween(interaction.sourceId, targetId);
            }
          }
        }
        setPendingEdgeSource(null);

      } else if (isClick) {
        // [CÁCH 2]: Chạm lần lượt 2 đỉnh để nối (Tap to Connect)
        if (pendingEdgeSource && pendingEdgeSource !== nodeId) {
          createEdgeBetween(pendingEdgeSource, nodeId);
          setPendingEdgeSource(null); // Đã nối xong, hủy trạng thái
        } else if (pendingEdgeSource === nodeId) {
          setPendingEdgeSource(null); // Chạm lại chính nó thì hủy chọn
        } else {
          setPendingEdgeSource(nodeId); // Chạm lần đầu, đánh dấu đỉnh này để chờ nối
        }
      }
    } else if (isClick) {
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

  // --- HỖ TRỢ ZOOM 2 NGÓN TAY VÀ VUỐT (MOBILE MULTI-TOUCH) ---
  const handleTouchStart = (e) => {
    if (e.touches.length >= 2) {
      isPinching.current = true;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      pinchDistanceRef.current = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length >= 2 && isPinching.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

      if (pinchDistanceRef.current) {
        const delta = dist / pinchDistanceRef.current;
        let newScale = Math.min(Math.max(transform.scale * delta, 0.3), 3);

        const clientX = (touch1.clientX + touch2.clientX) / 2;
        const clientY = (touch1.clientY + touch2.clientY) / 2;

        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          const mouseX = clientX - rect.left;
          const mouseY = clientY - rect.top;

          setTransform(prev => ({
            x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
            y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
            scale: newScale
          }));
        }
      }
      pinchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && interaction.type === 'playingGamePath') {
      // Hỗ trợ Seamless Drag trên màn hình cảm ứng
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const elem = document.elementFromPoint(clientX, clientY);
      const targetNode = elem?.closest('[data-nodeid]');
      if (targetNode) {
        const targetId = targetNode.getAttribute('data-nodeid');
        if (targetId) handleGamePathMove(targetId);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      isPinching.current = false;
      pinchDistanceRef.current = null;
    }
  };

  const resetVisualizer = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsPlaying(false);
    setViewingStaticPath(null);
    setFoundPaths([]);
    setGamePath([]); // Reset game path khi reset
  };

  const getEffectiveStartNodes = () => {
    if (searchAllNodes) return nodes.map(n => n.id);
    if (startNode) return [startNode];
    const defaultNode = nodes.find(n => n.label === '1' || n.id === 'n1') || nodes[0];
    if (defaultNode) return [defaultNode.id];
    return [];
  };

  const runFastGlobalSearch = () => {
    const startNodesToRun = searchAllNodes ? nodes.map(n => n.id) : getEffectiveStartNodes();
    if (startNodesToRun.length === 0) {
      showToast("Không tìm thấy đỉnh hợp lệ để bắt đầu!");
      return;
    }

    // --- CHECK ISOLATED NODES ---
    if (nodes.length > 1) {
      const hasIsolatedNode = nodes.some(node =>
        !edges.some(edge => edge.source === node.id || edge.target === node.id)
      );
      if (hasIsolatedNode) {
        showToast("Bản đồ có đỉnh bị cô lập, KHÔNG THỂ có đường đi Hamilton!");
        setFastResults([]);
        setShowFastResultsModal(true);
        setSteps([]); setCurrentStepIndex(-1); setIsPlaying(false); setViewingStaticPath(null);
        return;
      }
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
    if (window.innerWidth < 768) setShowMobileRight(false);
  };

  const generateSteps = () => {
    const startNodesToRun = getEffectiveStartNodes();
    if (startNodesToRun.length === 0) {
      showToast("Chưa có đỉnh nào trên bản đồ!");
      return;
    }

    // --- CHECK ISOLATED NODES ---
    if (nodes.length > 1) {
      const hasIsolatedNode = nodes.some(node =>
        !edges.some(edge => edge.source === node.id || edge.target === node.id)
      );
      if (hasIsolatedNode) {
        showToast("Bản đồ có đỉnh cô lập, KHÔNG THỂ có đường đi Hamilton!");
        setViewingStaticPath(null);
        setFoundPaths([]);
        setSteps([
          { type: 'start', path: [], current: null, action: `Khởi tạo thuật toán Backtracking...` },
          { type: 'fail', path: [], action: 'DỪNG SỚM: Phát hiện ít nhất 1 đỉnh bị cô lập (không có cạnh nối).' }
        ]);
        setCurrentStepIndex(1);
        setIsPlaying(false);
        return;
      }
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

    if (window.innerWidth < 768) setShowMobileRight(false);
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

  const handleSkipToNextResult = () => {
    if (currentStepIndex < 0 || steps.length === 0) return;
    
    setIsPlaying(false);
    let nextSuccessIdx = -1;
    
    // Tìm index của kết quả success tiếp theo trong mảng steps
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
      if (steps[i].type === 'success') {
        nextSuccessIdx = i;
        break;
      }
    }

    if (nextSuccessIdx !== -1) {
      setCurrentStepIndex(nextSuccessIdx);
      
      // Thu thập tất cả các path success từ đầu đến vị trí này để hiển thị chính xác số thứ tự
      const newPaths = [];
      let successCount = 0;
      for (let i = 0; i <= nextSuccessIdx; i++) {
        if (steps[i].type === 'success') {
          successCount++;
          newPaths.push({ path: steps[i].path, startNodeLabel: steps[i].startNodeLabel });
        }
      }

      setFoundPaths(curr => {
        const updated = [...curr];
        newPaths.forEach(np => {
          if (!updated.some(p => p.path.join() === np.path.join())) {
            updated.push(np);
          }
        });
        return updated;
      });

      setViewingStaticPath(steps[nextSuccessIdx].path);
      showToast(`Đã tua nhanh đến kết quả #${successCount}`);
    } else {
      // Nếu không còn success nào phía sau, nhảy thẳng đến hết mảng
      setCurrentStepIndex(steps.length - 1);
      
      const newPaths = [];
      steps.forEach(step => {
        if (step.type === 'success') {
          newPaths.push({ path: step.path, startNodeLabel: step.startNodeLabel });
        }
      });

      setFoundPaths(curr => {
        const updated = [...curr];
        newPaths.forEach(np => {
          if (!updated.some(p => p.path.join() === np.path.join())) {
            updated.push(np);
          }
        });
        return updated;
      });

      showToast("Đã là kết quả cuối cùng");
    }
  };

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

  if (mode === 'play') {
    activePath = gamePath;
    currentActiveNode = gamePath[gamePath.length - 1];
  } else if (viewingStaticPath) {
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
  const isPlayMode = mode === 'play';

  // --- Theme Variables cho SVG ---
  const nodeDefaultFill = isDark ? "#1e293b" : "#ffffff";
  const nodeDefaultStroke = isDark ? "#475569" : "#cbd5e1";
  const textDefaultFill = isDark ? "#f8fafc" : "#0f172a";
  const edgeDefaultStroke = isDark ? "#334155" : "#94a3b8";
  const drawingEdgeStroke = isDark ? "#64748b" : "#94a3b8";
  const startNodeStroke = isDark ? "#6366f1" : "#4f46e5";

  // Grid background
  const gridLineColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div id="hamilton-app-wrapper" className={`${theme} flex flex-col h-[100dvh] w-full overflow-hidden font-sans selection:bg-indigo-500/30 touch-none`}>
      <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300">

        {/* CUSTOM TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-indigo-600/95 backdrop-blur-sm text-white rounded-xl shadow-2xl font-bold text-sm text-center animate-[slideDownToast_0.3s_ease-out] border border-indigo-400/30 max-w-[90vw]">
            {toastMessage}
          </div>
        )}

        {/* HEADER */}
        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-3 md:p-4 flex justify-between items-center shadow-sm dark:shadow-lg z-30 shrink-0 h-14 md:h-16 transition-colors duration-300">
          <button onClick={() => setShowMobileLeft(true)} className="md:hidden p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center md:justify-start">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              <Cpu size={18} className="text-white" />
            </div>
            <h1 className="text-base md:text-lg font-black bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent uppercase tracking-wider truncate">
              Hamilton Simulator
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Đổi giao diện Sáng/Tối">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setShowMobileRight(true)} className="md:hidden p-2 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/40">
              <Settings2 size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">

          {/* OVERLAYS CHO MOBILE */}
          {showMobileLeft && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowMobileLeft(false)} />}
          {showMobileRight && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setShowMobileRight(false)} />}

          {/* === SIDEBAR TRÁI: XÂY MAP & CHỌN MÀN === */}
          <div
            style={{ width: window.innerWidth >= 768 ? leftPanelWidth : '260px' }}
            className={`
              fixed left-0 top-14 md:top-0 bottom-0 md:inset-y-0 z-50 md:static md:z-10 flex-shrink-0 
              bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
              transform transition-transform duration-300 ease-in-out select-none
              ${showMobileLeft ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}
          >
            <div className="w-full h-full p-3 md:p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden pt-0 md:pt-2">

              <button onClick={() => setShowMobileLeft(false)} className="md:hidden absolute top-4 right-4 p-2 text-slate-500 hover:text-red-500 rounded-full bg-slate-100 dark:bg-slate-800 z-50">
                <X size={18} />
              </button>

              <div className="hidden md:flex items-center justify-between mb-2 shrink-0 px-1">
                {isSidebarExpanded && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate flex-1">Chỉnh sửa Map</div>}
                <button onClick={toggleSidebar} className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition shrink-0 mx-auto" title="Thu gọn / Mở rộng">
                  <Menu size={16} />
                </button>
              </div>

              <div className="md:hidden text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 pt-4">Công cụ bản đồ</div>

              {/* NÚT PLAY MODE */}
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<Gamepad2 />} label="Tự chơi (Giải đố)" mode="play" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} activeClasses="text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100 dark:bg-fuchsia-500/10 border-fuchsia-400 dark:border-fuchsia-500/50" />

              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<MousePointer2 />} label="Chọn / Kéo thả" mode="select" current={mode} setMode={setMode} locked={false} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<PlusCircle />} label="Thêm đỉnh" mode="addNode" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<GitMerge />} label="Nối cạnh" mode="addEdge" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<Trash2 />} label="Xóa (Đỉnh/Cạnh)" mode="remove" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath} />
              <ToolBtn isExpanded={window.innerWidth < 768 || isSidebarExpanded} icon={<MapPin />} label="Chọn Gốc" mode="setStart" current={mode} setMode={setMode} locked={currentStepIndex >= 0 || viewingStaticPath || searchAllNodes} activeClasses="text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 border-amber-400 dark:border-amber-500/50" />

              <button onClick={resetCurrentMap} className={`mt-1 flex items-center justify-center ${(window.innerWidth < 768 || isSidebarExpanded) ? 'justify-start px-3' : 'px-0'} gap-3 py-2 bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30 rounded transition`}>
                <RefreshCw size={16} className="shrink-0" /> {(window.innerWidth < 768 || isSidebarExpanded) && <span className="text-[11px] font-bold truncate">Reset Màn</span>}
              </button>

              <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-1 shrink-0"></div>

              {(window.innerWidth < 768 || isSidebarExpanded) && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 truncate px-1">Cấp độ & Bản đồ</div>}

              <div className={`grid ${(window.innerWidth < 768 || isSidebarExpanded) ? 'grid-cols-3' : 'grid-cols-1'} gap-2 mb-2 shrink-0 px-1`}>
                <button
                  onClick={() => { setCurrentLevel('custom'); setMode('select'); if(window.innerWidth < 768) setShowMobileLeft(false); }}
                  title="Màn chơi tùy chỉnh của riêng bạn"
                  className={`${(window.innerWidth < 768 || isSidebarExpanded) ? 'col-span-3 py-2' : 'col-span-1 aspect-square'} flex items-center justify-center rounded border font-black text-[10px] transition-all uppercase tracking-wider ${currentLevel === 'custom' ? 'bg-amber-500 text-white border-amber-400 shadow-md dark:shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  {(window.innerWidth < 768 || isSidebarExpanded) ? 'Màn Tùy chỉnh' : 'Cus'}
                </button>
                {MAP_LEVELS.map((lvl, index) => {
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => { loadLevel(lvl, index); }}
                      title={lvl.name}
                      className={`flex items-center justify-center aspect-square rounded border font-black text-xs transition-all ${currentLevel === index ? 'bg-indigo-500 text-white border-indigo-400 shadow-md dark:shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>

              {/* Các nút Zoom xếp dọc (Desktop) hoặc ngang (Mobile) */}
              <div className="mt-auto flex md:flex-col flex-row justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 md:mx-auto md:w-full md:max-w-[48px]">
                <button onClick={() => handleZoom(1.2)} className="p-2 md:p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><ZoomIn size={16} /></button>
                <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="p-2 md:p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><Maximize size={16} /></button>
                <button onClick={() => handleZoom(0.8)} className="p-2 md:p-2 flex-1 md:flex-none bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 shadow-sm transition flex justify-center"><ZoomOut size={16} /></button>
              </div>
            </div>

            <div
              onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingLeft' }); }}
              className="hidden md:flex absolute top-0 -right-2 w-4 h-full cursor-col-resize z-30 hover:bg-blue-500/20 transition-colors justify-center items-center group"
            >
              <div className="w-1 h-12 bg-slate-300 dark:bg-slate-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>
          </div>

          {/* === KHU VỰC VẼ CANVAS CHÍNH === */}
          <div
            className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-slate-950/80 shadow-inner flex flex-col"
            onPointerMove={onPointerMove}
            onPointerUp={onSvgPointerUp}
            onPointerLeave={onSvgPointerUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'none' }} // Ngăn chặn native scroll trên mobile khi vuốt canvas
          >
            {/* Lưới nền Game */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`, backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`, backgroundPosition: `${transform.x}px ${transform.y}px` }}></div>

            {mode === 'play' && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-fuchsia-600/90 text-white rounded-full font-bold shadow-lg shadow-fuchsia-500/30 text-sm animate-pulse whitespace-nowrap">
                Chế độ Giải Đố: Chọn đỉnh kề nhau!
              </div>
            )}

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
                    stroke={drawingEdgeStroke} strokeWidth={3} strokeDasharray="4 4" className="pointer-events-none opacity-60"
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

                  let stroke = edgeDefaultStroke, strokeWidth = 3, strokeDash = "none", classes = "transition-all duration-300";

                  if (isPathEdge) {
                    stroke = mode === 'play' ? (isDark ? "#d946ef" : "#c026d3") : (isDark ? "#10b981" : "#059669"); // Màu hồng cho chế độ Play
                    strokeWidth = 6;
                  } else if (isCheckingEdge) {
                    stroke = isDark ? "#f59e0b" : "#d97706"; strokeWidth = 4; strokeDash = "6,4"; classes += " animate-[dash_1s_linear_infinite]";
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
                  const arrowColor = mode === 'play' ? (isDark ? "#fdf4ff" : "#f0abfc") : (isDark ? "#d1fae5" : "#059669");

                  return (
                    <g key={`arrow-${idx}`} transform={`translate(${midX}, ${midY}) rotate(${angle})`} className="pointer-events-none transition-all duration-300 drop-shadow-md">
                      <polygon points="-10,-8 10,0 -10,8" fill={arrowColor} />
                    </g>
                  );
                })}

                {/* Vẽ Đỉnh */}
                {nodes.map(node => {
                  const isStart = effectiveStartNodes.includes(node.id) && currentStepIndex < 0 && !viewingStaticPath;
                  const isInPath = (activePath || []).includes(node.id);
                  const isCurrent = currentActiveNode === node.id;
                  const isBacktracked = backtrackedNode === node.id;

                  // Hiệu ứng Visual nếu node đang được Tap để chờ nối (Mobile/Desktop)
                  const isPendingEdge = mode === 'addEdge' && pendingEdgeSource === node.id;

                  let fill = nodeDefaultFill, stroke = nodeDefaultStroke, strokeW = 2, radius = 24, zIndexClass = "", strokeDash = "none";

                  if (isCurrent) {
                    fill = mode === 'play' ? (isDark ? "#d946ef" : "#c026d3") : (isDark ? "#f59e0b" : "#fbbf24"); 
                    stroke = mode === 'play' ? (isDark ? "#f0abfc" : "#a21caf") : (isDark ? "#fbbf24" : "#b45309"); 
                    strokeW = 4; radius = 28; 
                    zIndexClass = mode === 'play' ? (isDark ? `drop-shadow-[0_0_15px_rgba(217,70,239,0.6)]` : `drop-shadow-lg`) : (isDark ? `drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]` : `drop-shadow-lg`);
                  } else if (isPendingEdge) {
                    fill = isDark ? "#1e3a8a" : "#eff6ff"; stroke = isDark ? "#60a5fa" : "#3b82f6"; strokeW = 4; radius = 26; zIndexClass = isDark ? `drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]` : `drop-shadow-md`;
                  } else if (isInPath) {
                    fill = mode === 'play' ? (isDark ? "#a21caf" : "#d946ef") : (isDark ? "#10b981" : "#34d399"); 
                    stroke = mode === 'play' ? (isDark ? "#d946ef" : "#86198f") : (isDark ? "#34d399" : "#047857"); 
                    strokeW = 3;
                  } else if (isBacktracked) {
                    fill = isDark ? "#ef4444" : "#f87171"; stroke = isDark ? "#f87171" : "#b91c1c"; strokeW = 2; zIndexClass = "animate-[shake_0.5s_ease-in-out]";
                  } else if (isStart) {
                    stroke = startNodeStroke; strokeW = 4;
                  }

                  const isAlgorithmActive = isPlaying || currentStepIndex >= 0 || viewingStaticPath;
                  let interactiveClasses = '';

                  if (!isAlgorithmActive) {
                    interactiveClasses = mode === 'remove' ? 'hover:stroke-red-500 hover:fill-red-200 dark:hover:fill-red-900 cursor-pointer' :
                      mode === 'addEdge' ? 'hover:stroke-indigo-500 dark:hover:stroke-indigo-400 hover:fill-indigo-100 dark:hover:fill-indigo-900 cursor-pointer' :
                        (mode === 'setStart' || mode === 'select') ? 'hover:stroke-emerald-500 dark:hover:stroke-emerald-400 cursor-pointer cursor-grab active:cursor-grabbing' : 
                        mode === 'play' ? 'hover:stroke-fuchsia-400 cursor-pointer' : 'cursor-grab active:cursor-grabbing';
                  } else {
                    interactiveClasses = 'cursor-grab active:cursor-grabbing hover:stroke-amber-500 dark:hover:stroke-amber-400';
                  }

                  return (
                    // data-nodeid QUAN TRỌNG: để Drag & Drop elementFromPoint có thể nhận diện đỉnh dưới con trỏ
                    <g
                      key={node.id}
                      data-nodeid={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onPointerDown={(e) => onNodePointerDown(e, node.id)}
                      onPointerUp={(e) => onNodePointerUp(e, node.id)}
                      className={`transition-all duration-300 ${interactiveClasses} ${zIndexClass}`}
                    >
                      <circle r={radius} fill={fill} stroke={stroke} strokeWidth={strokeW} strokeDasharray={strokeDash} className="transition-all duration-300" />
                      <text textAnchor="middle" dominantBaseline="central" fill={mode === 'play' && isInPath ? "#ffffff" : textDefaultFill} className="font-bold select-none pointer-events-none text-sm">{node.label}</text>
                      {isStart && <text y={-35} textAnchor="middle" className={`text-[10px] font-black ${isDark ? 'fill-indigo-400' : 'fill-indigo-600'} pointer-events-none`}>GỐC</text>}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* CONSOLE LOG BÊN DƯỚI CANVAS */}
            {showLogs && (
              <div style={{ height: logHeight }} className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.5)] relative z-20 shrink-0">

                <div
                  onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingLog' }); }}
                  className="flex absolute top-0 left-0 w-full h-4 cursor-ns-resize z-30 hover:bg-blue-500/20 dark:hover:bg-blue-500/50 transition-colors justify-center items-center group"
                >
                  <GripHorizontal size={16} className="text-slate-400 dark:text-slate-500 opacity-30 group-hover:opacity-100" />
                </div>

                <div className="px-3 py-1.5 mt-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 shrink-0">
                  <span className="flex items-center gap-1 font-bold"><Terminal size={14} /> SYSTEM LOG (Tiến trình duyệt)</span>
                </div>
                <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 bg-white dark:bg-slate-950">
                  {steps.slice(0, currentStepIndex + 1).map((s, i) => (
                    <div key={i} className={`
                       ${s.type === 'visit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}
                       ${s.type === 'backtrack' ? 'text-red-500 dark:text-red-400 line-through opacity-80' : ''}
                       ${s.type === 'check_edge' ? 'text-amber-600 dark:text-amber-300' : ''}
                       ${s.type === 'skip' ? 'text-slate-400 dark:text-slate-500' : ''}
                       ${s.type === 'deadend' ? 'text-orange-600 dark:text-orange-500 bg-orange-100 dark:bg-orange-500/10 inline-block px-1 rounded' : ''}
                       ${s.type === 'success' ? 'text-white font-bold bg-emerald-500 dark:bg-emerald-600 px-2 py-1 rounded inline-block my-1' : ''}
                       ${s.type === 'info' ? 'text-blue-600 dark:text-blue-300' : ''}
                       ${s.type === 'finish' ? 'text-fuchsia-600 dark:text-fuchsia-400 font-bold text-sm mt-2' : ''}
                     `}>
                      <span className="opacity-40 select-none mr-2">[{String(i).padStart(3, '0')}]</span>
                      {s.action}
                    </div>
                  ))}
                  {currentStepIndex < 0 && <div className="text-slate-500 dark:text-slate-600 italic">Đang chờ lệnh chạy thuật toán...</div>}
                  <div ref={logEndRef} />
                </div>
              </div>
            )}

            {/* POPUP: KẾT QUẢ TÌM SIÊU TỐC */}
            {showFastResultsModal && (
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm z-50 flex flex-col p-4 md:p-8">
                <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0 pt-10 md:pt-0">
                  <h2 className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Zap size={24} className="md:w-7 md:h-7" /> Kết quả Tìm Siêu Tốc ({fastResults.length})
                  </h2>
                  <button onClick={() => setShowFastResultsModal(false)} className="p-2 bg-slate-200 dark:bg-slate-800 hover:bg-red-500 hover:text-white dark:text-white rounded transition shadow-sm"><X size={20} className="md:w-6 md:h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
                  {fastResults.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-10">Không tìm thấy đường đi Hamilton nào trên bản đồ này!</div>
                  ) : (
                    fastResults.map((path, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setViewingStaticPath(path.path); setShowFastResultsModal(false); }}
                        className="p-3 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-600 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-lg text-left transition-all shadow-sm group"
                      >
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-200">Đường đi {idx + 1} (đỉnh {path.startNodeLabel})</div>
                        <div className="font-mono text-sm text-slate-800 dark:text-white flex flex-wrap items-center gap-1">
                          {path.path.map((n, i) => (
                            <React.Fragment key={i}>
                              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">{getLabel(n)}</span>
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
          <div
            style={{ width: window.innerWidth >= 768 ? rightPanelWidth : '320px' }}
            className={`
              fixed right-0 top-14 md:top-0 bottom-0 md:inset-y-0 z-50 md:static md:z-20 flex-shrink-0 
              bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl md:shadow-none
              transform transition-transform duration-300 ease-in-out select-none
              ${showMobileRight ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
            `}
          >
            <button onClick={() => setShowMobileRight(false)} className="md:hidden absolute top-4 left-4 p-2 text-slate-500 hover:text-red-500 rounded-full bg-slate-100 dark:bg-slate-800 z-50">
              <X size={18} />
            </button>

            <div
              onPointerDown={(e) => { e.preventDefault(); setInteraction({ type: 'resizingRight' }); }}
              className="hidden md:flex absolute top-0 -left-2 w-4 h-full cursor-col-resize z-30 hover:bg-blue-500/20 transition-colors justify-center items-center group"
            >
              <div className="w-1 h-12 bg-slate-300 dark:bg-slate-600 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"></div>
            </div>

            <div className="w-full h-full flex flex-col overflow-y-auto overflow-x-hidden pt-14 md:pt-0">
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shrink-0">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent uppercase tracking-widest flex items-center gap-2">
                    <Cpu size={16} className="text-blue-500 dark:text-blue-400" /> Bộ điều khiển
                  </h2>
                  <button onClick={resetVisualizer} className="px-2 py-1.5 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-600 hover:text-red-500 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/50 rounded text-xs font-bold flex items-center gap-1 transition shadow-sm">
                    <RotateCcw size={14} /> <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  <label className={`flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 transition shadow-sm ${isPlayMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <input type="checkbox" disabled={isPlayMode} checked={searchAllNodes} onChange={(e) => { setSearchAllNodes(e.target.checked); resetVisualizer(); }} className="accent-blue-500 w-4 h-4 disabled:cursor-not-allowed" />
                    <span>Tìm trên <b>Mọi đỉnh</b> thay vì Gốc</span>
                  </label>

                  <button disabled={isPlayMode} onClick={runFastGlobalSearch} className={`w-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 py-2 rounded border border-slate-300 dark:border-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm ${isPlayMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-700 dark:hover:text-white hover:border-blue-400'}`}>
                    <Zap size={16} /> Tìm siêu tốc (Xuất List)
                  </button>
                </div>

                <div className="flex gap-2 mb-4">
                  {currentStepIndex < 0 ? (
                    <button disabled={isPlayMode} onClick={generateSteps} className={`flex-1 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-md ${isPlayMode ? 'bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                      <Play size={18} fill="currentColor" /> CHẠY BACKTRACK
                    </button>
                  ) : isCurrentStepSuccess ? (
                    <button disabled={isPlayMode} onClick={handleNextPath} className={`flex-1 text-white py-2.5 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-md animate-pulse ${isPlayMode ? 'bg-slate-400 dark:bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 dark:shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}>
                      <MapIcon size={18} /> TÌM ĐƯỜNG TIẾP
                    </button>
                  ) : (
                    <>
                      <button disabled={currentStepIndex >= steps.length - 1 || isPlayMode} onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 text-white py-2 rounded-md font-bold flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying ? 'bg-rose-500 hover:bg-rose-600' : 'bg-blue-600 hover:bg-blue-700'} ${isPlayMode ? 'opacity-50 bg-slate-400 dark:bg-slate-700' : ''}`}>
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                      <button disabled={steps.length === 0 || isPlayMode} onClick={handleSkipToNextResult} title="Tua nhanh đến kết quả tiếp theo" className={`w-14 bg-slate-200 dark:bg-slate-800 py-2 rounded flex justify-center text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm ${isPlayMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-300 dark:hover:bg-slate-700'}`}>
                        <SkipForward size={18} />
                      </button>
                    </>
                  )}
                </div>

                <div className={`flex items-center gap-2 md:gap-3 ${isPlayMode ? 'opacity-50' : ''}`}>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Chậm</span>
                  <input type="range" disabled={isPlayMode} min="100" max="1500" step="100" value={1600 - speed} onChange={(e) => setSpeed(1600 - Number(e.target.value))} className="flex-1 accent-blue-500 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none disabled:cursor-not-allowed cursor-pointer" />
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Nhanh</span>

                  <button disabled={isPlayMode} onClick={() => setShowLogs(!showLogs)} className={`p-1.5 ml-1 rounded transition text-xs flex items-center justify-center border shadow-sm ${isPlayMode ? 'cursor-not-allowed' : ''} ${showLogs ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-transparent' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-transparent'}`} title="Bật/Tắt Log Tiến trình">
                    {showLogs ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Stack Trực Quan Hóa */}
              <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-transparent">
                <div className="flex-1 p-4 overflow-y-auto relative">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2"><GitMerge size={14} /> Stack Trực Quan</h3>
                  {viewingStaticPath ? (
                    <div className="text-emerald-700 dark:text-emerald-400 text-sm p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded text-center font-medium shadow-sm">
                      Đang xem lại Kết quả.<br />Hãy bấm "Reset" để bắt đầu tìm kiếm mới.
                    </div>
                  ) : (
                    <div className="relative pt-2">
                      {(activePath || []).length === 0 && !isPopping && <div className="text-slate-500 dark:text-slate-600 text-sm italic text-center py-4 border border-dashed border-slate-300 dark:border-slate-700 rounded">Stack trống</div>}

                      {isPopping && backtrackedNode && (
                        <div key={`pop-${currentStepIndex}`} className="absolute top-2 left-0 w-full flex items-center gap-2 md:gap-3 animate-[slideUpOut_0.5s_ease-out_forwards] z-10 h-10 md:h-12">
                          <div className="w-5 md:w-6 text-right text-[10px] md:text-xs text-slate-400 dark:text-slate-500 font-mono">#{activePath.length + 1}</div>
                          <div className="flex-1 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded p-2 flex items-center gap-2 md:gap-3 shadow-sm h-full box-border">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-[10px] md:text-xs">{getLabel(backtrackedNode)}</div>
                            <span className="text-xs md:text-sm text-red-600 dark:text-red-300 font-medium">Pop (Xóa khỏi Stack)</span>
                          </div>
                        </div>
                      )}

                      <div className={`flex flex-col gap-2 transition-all duration-500 ${isPopping ? 'translate-y-12 md:translate-y-14' : 'translate-y-0'}`}>
                        {(activePath || []).slice().reverse().map((nodeId, idx) => {
                          const actualStackIndex = activePath.length - 1 - idx;
                          const isNewest = !isPopping && idx === 0;
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
                  )}
                </div>

                {/* Bảng Lịch Sử Kết Quả */}
                <div className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col transition-all duration-300 shrink-0 ${showResultsHistory ? 'h-48 md:h-56' : 'h-10'}`}>
                  <button onClick={() => setShowResultsHistory(!showResultsHistory)} className="px-3 md:px-4 py-2.5 bg-slate-100 dark:bg-slate-950 flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer">
                    <span className="flex items-center gap-2"><List size={14} /> Kết Quả Đã Tìm ({foundPaths.length})</span>
                    {showResultsHistory ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </button>

                  {showResultsHistory && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {foundPaths.length === 0 ? (
                        <div className="text-center text-xs text-slate-500 dark:text-slate-600 py-4 italic">Chưa tìm thấy đường đi nào...</div>
                      ) : (
                        foundPaths.map((s, i) => {
                          const isActive = viewingStaticPath === s.path;
                          return (
                            <button
                              key={i}
                              onClick={() => setViewingStaticPath(s.path)}
                              className={`w-full text-left text-xs p-2 rounded transition-all border shadow-sm ${isActive ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'}`}
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
      </div>

      <style>{`
        @keyframes dash { to { stroke-dashoffset: -10; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes shake { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(-3px, 0); } 75% { transform: translate(3px, 0); } }
        
        @keyframes slideDownIn { 
           0% { opacity: 0; transform: translateY(-48px); } 
           100% { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideUpOut { 
           0% { opacity: 1; transform: translateY(0); } 
           100% { opacity: 0; transform: translateY(-48px); } 
        }
        @keyframes slideDownToast {
           0% { opacity: 0; transform: translate(-50%, -20px); }
           100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

function ToolBtn({ icon, label, mode, current, setMode, locked, activeClasses, isExpanded }) {
  const isActive = mode === current;
  const defaultActiveClass = "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/50 font-bold";
  const activeStyle = activeClasses || defaultActiveClass;

  return (
    <button
      onClick={() => setMode(mode)} disabled={locked} title={label}
      className={`w-full flex items-center ${isExpanded ? 'justify-start px-3' : 'justify-center px-0'} gap-3 py-2 md:py-2.5 rounded-lg border transition-all shadow-sm ${locked ? 'opacity-30 cursor-not-allowed border-transparent shadow-none' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800'
        } ${isActive ? activeStyle : 'border-transparent text-slate-600 dark:text-slate-400 bg-white dark:bg-transparent shadow-none'
        }`}
    >
      <span className={`shrink-0 ${isActive ? "" : "opacity-80"}`}>{React.cloneElement(icon, { size: 18 })}</span>
      {isExpanded && <span className="text-xs md:text-[11px] font-medium flex-1 truncate text-left">{label}</span>}
    </button>
  );
}