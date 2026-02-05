
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

// --- Translations ---
const translations = {
    en: {
        title: 'Cell Lab Manager',
        languageName: 'Español',
        cellLine: 'Cell Line',
        passage: 'Passage',
        freezingDate: 'Freezing Date',
        storageDate: 'Storage Date',
        withdrawalDate: 'Withdrawal Date',
        tank: 'Tank',
        canister: 'Canister',
        rack: 'Rack',
        position: 'Position',
        storedBy: 'Stored By',
        withdrawnBy: 'Withdrawn By',
        comments: 'Comments',
        addComment: 'Add Comment',
        editComment: 'Edit Comment',
        viewComment: 'View Comment',
        deleteComment: 'Delete Comment',
        confirmDeleteComment: 'Are you sure you want to delete this comment?',
        search: 'Search current inventory...',
        exportExcel: 'Export Excel',
        importExcel: 'Import Excel',
        manual: 'Download Manual',
        downloadApp: 'Download App',
        save: 'Save Record',
        actions: 'Actions',
        confirmDelete: 'Are you sure you want to delete this record?',
        noData: 'No records found',
        totalStored: 'Current Inventory',
        contactInfo: 'This application is free to use. Feel free to share it. Send an email to migisber@ucm.es for queries or suggestions.',
        importSuccess: 'Data imported successfully!',
        importError: 'Error importing data. Please check the file format.',
        invalidDateError: 'Error: Storage date cannot be earlier than freezing date.',
        duplicatePositionError: 'Error: This position is already occupied in the current inventory.',
        edit: 'Edit',
        cancel: 'Cancel',
        withdraw: 'Withdraw',
        withdrawTitle: 'Quick Withdrawal',
        withdrawSearchPlaceholder: 'Search by Cell Line',
        whoIsWithdrawing: 'Who is withdrawing these cells?',
        confirmWithdraw: 'Confirm Withdrawal',
        inventoryTab: 'Current Inventory',
        historyTab: 'Withdrawal Log',
        freeSpacesTab: 'Free Spaces',
        storageSection: 'Add to Storage',
        withdrawalSection: 'Manage Withdrawal',
        addFreeSpaceSection: 'Record Free Gap',
        stockOverview: 'Stock by Line',
        vials: 'vials',
        manualTitle: 'User Manual - Cell Lab Manager',
        manualBody: [
            '1. Overview: Cell Lab Manager is a specialized tool for tracking cell line vials stored in liquid nitrogen tanks.',
            '2. User Interface and Language:',
            '   - Use the top right buttons to toggle between English and Spanish.',
            '   - Use "Download App" to save a portable .html version for offline use.',
            '3. Adding Vials (Storage):',
            '   - Enter the Cell Line and Passage number in the left panel.',
            '   - Specify the Freezing and Storage dates (Storage cannot precede Freezing).',
            '   - Define the exact physical location: Tank, Canister, Rack, and Position.',
            '   - Important: The application prevents duplicate entries for the same physical position in the current inventory.',
            '4. Inventory Management and Filtering:',
            '   - Search Bar: Use the search input above the table for quick keyword filtering.',
            '   - Stock by Line: The "Stock by Line" section shows an automated summary. Click on any cell line chip (e.g., HeLa (3)) to instantly filter the inventory table to only show that specific line.',
            '   - Tabs: Switch between "Current Inventory", "Withdrawal Log", and "Free Spaces" to manage your database.',
            '5. Free Spaces Management:',
            '   - Use the "Free Spaces" tab to maintain a list of verified empty locations. You can add new empty slots using the internal form within that tab.',
            '6. Withdrawing Vials:',
            '   - Quick Withdrawal: Use the dedicated search bar on the bottom-left panel.',
            '   - Manual Removal: Click the orange arrow icon next to any vial in the inventory table.',
            '   - Confirmation: You must enter the name of the person withdrawing the cells to maintain the audit trail.',
            '7. Data Portability:',
            '   - Export Excel: Save your entire database to a spreadsheet for backup.',
            '   - Import Excel: Restore your inventory or bulk upload data using the standard exported format.',
            '8. Comments: You can add specific notes to any vial using the chat bubble icon in the actions menu. Vials with comments show a small icon next to their name. You can also delete these comments if they are no longer needed.'
        ]
    },
    es: {
        title: 'Cell Lab Manager',
        languageName: 'English',
        cellLine: 'Línea Celular',
        passage: 'Pase',
        freezingDate: 'Fecha de Congelación',
        storageDate: 'Fecha de Almacenamiento',
        withdrawalDate: 'Fecha de Retirada',
        tank: 'Tanque',
        canister: 'Canasta',
        rack: 'Rack',
        position: 'Posición',
        storedBy: 'Almacenado por',
        withdrawnBy: 'Retirado por',
        comments: 'Comentarios',
        addComment: 'Añadir Comentario',
        editComment: 'Editar Comentario',
        viewComment: 'Ver Comentario',
        deleteComment: 'Eliminar Comentario',
        confirmDeleteComment: '¿Estás seguro de que quieres eliminar este comentario?',
        search: 'Buscar en inventario actual...',
        exportExcel: 'Exportar Excel',
        importExcel: 'Importar Excel',
        manual: 'Descargar Manual',
        downloadApp: 'Descargar App',
        save: 'Guardar Registro',
        actions: 'Actions',
        confirmDelete: '¿Estás seguro de que quieres eliminar este registro?',
        noData: 'No se encontraron registros',
        totalStored: 'Inventario Actual',
        contactInfo: 'Esta aplicación es de uso libre y gratuito. Siéntete libre de compartirla. Manda un e-mail a migisber@ucm.es para consultas o sugerencias.',
        importSuccess: '¡Datos importados con éxito!',
        importError: 'Error al importar datos. Por favor revise el formato del archivo.',
        invalidDateError: 'Error: La fecha de almacenamiento no puede ser anterior a la fecha de congelación.',
        duplicatePositionError: 'Error: Esta posición ya está ocupada en el inventario actual.',
        edit: 'Editar',
        cancel: 'Cancelar',
        withdraw: 'Retirar',
        withdrawTitle: 'Retirada Rápida',
        withdrawSearchPlaceholder: 'Buscar por línea',
        whoIsWithdrawing: '¿Quién retira estas células?',
        confirmWithdraw: 'Confirmar Retirada',
        inventoryTab: 'Inventario Actual',
        historyTab: 'Registro de Retiradas',
        freeSpacesTab: 'Huecos Libres',
        storageSection: 'Añadir a Almacén',
        withdrawalSection: 'Gestionar Retirada',
        addFreeSpaceSection: 'Registrar Hueco Libre',
        stockOverview: 'Stock por Línea',
        vials: 'viales',
        manualTitle: 'Manual de Usuario - Cell Lab Manager',
        manualBody: [
            '1. Resumen: Cell Lab Manager es una herramienta especializada para el rastreo de viales criogenizados en tanques de nitrógeno líquido.',
            '2. Interfaz e Idioma:',
            '   - Use los botones superiores para alternar entre Inglés y Español.',
            '   - Use "Descargar App" para guardar una versión .html autónoma y usarla sin conexión.',
            '3. Añadir Viales (Almacenamiento):',
            '   - Introduzca la Línea Celular y el número de Pase en el panel izquierdo.',
            '   - Especifique las fechas de congelación y almacenamiento (esta última no puede ser anterior a la primera).',
            '   - Defina la ubicación física exacta: Tanque, Canasta, Rack y Posición.',
            '   - Importante: El sistema impide registros duplicados en la misma posición física dentro del inventario actual.',
            '4. Gestión y Filtrado del Inventario:',
            '   - Barra de Búsqueda: Use el buscador sobre la tabla para filtrar por palabras clave.',
            '   - Stock por Línea: La sección "Stock por Línea" muestra un resumen automático. Pulse sobre cualquier botón de línea (ej. HeLa (3)) para filtrar la tabla y ver solo los viales de esa línea específica.',
            '   - Pestañas: Alterne entre "Inventario Actual", "Registro de Retiradas" y "Huecos Libres" para gestionar su base de datos.',
            '5. Gestión de Espacios Libres:',
            '   - Utilice la pestaña "Huecos Libres" para mantener una lista de ubicaciones vacías verificadas. Puede añadir nuevos huecos usando el formulario interno de dicha pestaña.',
            '6. Retirada de Viales:',
            '   - Retirada Rápida: Use el buscador específico en el panel inferior izquierdo.',
            '   - Retirada Manual: Pulse el icono de flecha naranja en la fila del vial correspondiente en la tabla.',
            '   - Confirmación: Es obligatorio indicar quién retira las células para mantener el registro histórico.',
            '7. Portabilidad de Datos:',
            '   - Exportar Excel: Guarde toda su base de datos en una hoja de cálculo como copia de seguridad.',
            '   - Importar Excel: Restaure su inventario o cargue datos masivos usando el formato estándar de exportación.',
            '8. Comentarios: Puede añadir notas específicas a cualquier vial mediante el icono de burbuja de chat en el menú de acciones. Los viales con comentario mostrarán un pequeño icono junto a su nombre. También puede eliminar estos comentarios si ya no son necesarios.'
        ]
    }
};

const App = () => {
    const [lang, setLang] = useState<'en' | 'es'>('en');
    const [records, setRecords] = useState<any[]>([]);
    const [freeSpaces, setFreeSpaces] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLineFilter, setSelectedLineFilter] = useState<string | null>(null);
    const [withdrawSearch, setWithdrawSearch] = useState('');
    const [showContact, setShowContact] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewTab, setViewTab] = useState<'inventory' | 'history' | 'free'>('inventory');
    const [withdrawingCell, setWithdrawingCell] = useState<any>(null);
    const [withdrawerName, setWithdrawerName] = useState('');
    const [commentModalRecord, setCommentModalRecord] = useState<any>(null);
    const [tempComment, setTempComment] = useState('');

    const t = translations[lang];

    const initialFormState = {
        line: '', passage: '', freezingDate: new Date().toISOString().split('T')[0],
        storageDate: new Date().toISOString().split('T')[0], tank: '', canister: '',
        rack: '', position: '', storedBy: '', comment: ''
    };

    const initialFreeSpaceFormState = {
        tank: '', canister: '', rack: '', position: ''
    };

    const [form, setForm] = useState(initialFormState);
    const [freeSpaceForm, setFreeSpaceForm] = useState(initialFreeSpaceFormState);

    useEffect(() => {
        const savedRecords = localStorage.getItem('cell_lab_records_v2');
        if (savedRecords) setRecords(JSON.parse(savedRecords));
        
        const savedSpaces = localStorage.getItem('cell_lab_free_spaces');
        if (savedSpaces) setFreeSpaces(JSON.parse(savedSpaces));
    }, []);

    useEffect(() => {
        localStorage.setItem('cell_lab_records_v2', JSON.stringify(records));
    }, [records]);

    useEffect(() => {
        localStorage.setItem('cell_lab_free_spaces', JSON.stringify(freeSpaces));
    }, [freeSpaces]);

    const toggleLanguage = () => setLang(prev => (prev === 'en' ? 'es' : 'en'));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFreeSpaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFreeSpaceForm(prev => ({ ...prev, [name]: value }));
    };

    const inventory = useMemo(() => records.filter(r => r.status === 'stored'), [records]);
    const history = useMemo(() => records.filter(r => r.status === 'withdrawn'), [records]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(form.storageDate) < new Date(form.freezingDate)) {
            alert(t.invalidDateError);
            return;
        }

        const isPositionOccupied = inventory.some(r => 
            r.id !== editingId && 
            r.tank.trim().toLowerCase() === form.tank.trim().toLowerCase() && 
            r.canister.trim().toLowerCase() === form.canister.trim().toLowerCase() && 
            r.rack.trim().toLowerCase() === form.rack.trim().toLowerCase() && 
            r.position.trim().toLowerCase() === form.position.trim().toLowerCase()
        );

        if (isPositionOccupied) {
            alert(t.duplicatePositionError);
            return;
        }

        if (editingId) {
            setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r));
            setEditingId(null);
        } else {
            const newRecord = { ...form, id: crypto.randomUUID(), status: 'stored', createdAt: Date.now() };
            setRecords(prev => [newRecord, ...prev]);
        }
        setForm(initialFormState);
    };

    const handleFreeSpaceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSpace = { ...freeSpaceForm, id: crypto.randomUUID(), createdAt: Date.now() };
        setFreeSpaces(prev => [newSpace, ...prev]);
        setFreeSpaceForm(initialFreeSpaceFormState);
    };

    const deleteFreeSpace = (id: string) => {
        if (window.confirm(t.confirmDelete)) setFreeSpaces(prev => prev.filter(s => s.id !== id));
    };

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault();
        if (!withdrawingCell || !withdrawerName) return;
        setRecords(prev => prev.map(r => r.id === withdrawingCell.id ? { 
            ...r, status: 'withdrawn', withdrawnBy: withdrawerName, withdrawalDate: new Date().toISOString().split('T')[0] 
        } : r));
        setWithdrawingCell(null); setWithdrawerName(''); setWithdrawSearch('');
    };

    const handleSaveComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentModalRecord) return;
        setRecords(prev => prev.map(r => r.id === commentModalRecord.id ? { ...r, comment: tempComment } : r));
        setCommentModalRecord(null);
        setTempComment('');
    };

    const handleDeleteComment = () => {
        if (!commentModalRecord) return;
        if (window.confirm(t.confirmDeleteComment)) {
            setRecords(prev => prev.map(r => r.id === commentModalRecord.id ? { ...r, comment: '' } : r));
            setCommentModalRecord(null);
            setTempComment('');
        }
    };

    const deleteRecord = (id: string) => {
        if (window.confirm(t.confirmDelete)) setRecords(prev => prev.filter(r => r.id !== id));
    };

    const startEdit = (record: any) => {
        setEditingId(record.id);
        setForm({ ...record, comment: record.comment || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => { setEditingId(null); setForm(initialFormState); };

    const stockByLine = useMemo(() => {
        const counts: Record<string, number> = {};
        inventory.forEach(r => { 
            const line = r.line.trim(); 
            counts[line] = (counts[line] || 0) + 1; 
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [inventory]);

    const filteredInventory = useMemo(() => {
        const q = searchQuery.toLowerCase();
        let filtered = inventory;
        if (selectedLineFilter) {
            filtered = filtered.filter(r => r.line.trim() === selectedLineFilter);
        }
        return filtered.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(q)));
    }, [inventory, searchQuery, selectedLineFilter]);

    const filteredHistory = useMemo(() => {
        const q = searchQuery.toLowerCase();
        let filtered = history;
        if (selectedLineFilter) {
            filtered = filtered.filter(r => r.line.trim() === selectedLineFilter);
        }
        return filtered.filter(r => r.line.toLowerCase().includes(q) || (r.withdrawnBy && r.withdrawnBy.toLowerCase().includes(q)) || (r.comment && r.comment.toLowerCase().includes(q)));
    }, [history, searchQuery, selectedLineFilter]);

    const filteredFreeSpaces = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return freeSpaces.filter(s => Object.values(s).some(v => String(v).toLowerCase().includes(q)));
    }, [freeSpaces, searchQuery]);

    const withdrawSearchResults = useMemo(() => {
        if (withdrawSearch.length < 2) return [];
        return inventory.filter(r => r.line.toLowerCase().includes(withdrawSearch.toLowerCase()));
    }, [inventory, withdrawSearch]);

    const exportToExcel = () => {
        const wsData = records.map(r => ({
            [t.cellLine]: r.line, [t.passage]: r.passage, [t.freezingDate]: r.freezingDate,
            [t.storageDate]: r.storageDate, Status: r.status, [t.withdrawalDate]: r.withdrawalDate || '',
            [t.tank]: r.tank, [t.canister]: r.canister, [t.rack]: r.rack, [t.position]: r.position,
            [t.storedBy]: r.storedBy, [t.withdrawnBy]: r.withdrawnBy || '', [t.comments]: r.comment || ''
        }));
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Cells");
        XLSX.writeFile(wb, `CellLabData_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                const imported = jsonData.map((item: any) => ({
                    id: crypto.randomUUID(), line: String(item[t.cellLine] || ''),
                    passage: String(item[t.passage] || ''), freezingDate: String(item[t.freezingDate] || ''),
                    storageDate: String(item[t.storageDate] || ''), status: (item.Status || 'stored').toLowerCase(),
                    tank: String(item[t.tank] || ''), canister: String(item[t.canister] || ''),
                    rack: String(item[t.rack] || ''), position: String(item[t.position] || ''),
                    storedBy: String(item[t.storedBy] || ''), withdrawnBy: item[t.withdrawnBy],
                    withdrawalDate: item[t.withdrawalDate], createdAt: Date.now(),
                    comment: String(item[t.comments] || '')
                }));
                setRecords(imported);
            } catch (err) { alert(t.importError); }
        };
        reader.readAsArrayBuffer(file);
        e.target.value = '';
    };

    const downloadManual = () => {
        const doc = new jsPDF();
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(t.manualTitle, 20, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        let y = 35;
        t.manualBody.forEach(line => {
            const splitText = doc.splitTextToSize(line, 170);
            if (y + (splitText.length * 7) > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(splitText, 20, y);
            y += (splitText.length * 7) + 3;
        });
        
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Generated on: ${new Date().toLocaleString()} | Language: ${lang.toUpperCase()}`, 20, 285);
        window.open(doc.output('bloburl'), '_blank');
    };

    const downloadApp = () => {
        const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CellLabManager.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleToggleFilter = (line: string) => {
        if (selectedLineFilter === line) {
            setSelectedLineFilter(null);
        } else {
            setSelectedLineFilter(line);
            setViewTab('inventory');
        }
    };

    const openCommentModal = (record: any) => {
        setCommentModalRecord(record);
        setTempComment(record.comment || '');
    };

    const inputStyles = "w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400";
    const textareaStyles = "w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 min-h-[80px]";
    const searchInputStyles = "w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none focus:bg-white transition-all text-slate-800 font-medium";
    const quickWithdrawStyles = "w-full px-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition-all focus:bg-white text-slate-800 font-medium";

    return (
        <div className="min-h-screen pb-12 bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg"><i className="fa-solid fa-vial-circle-check text-white"></i></div>
                        <h1 className="text-xl font-black text-slate-800">Cell Lab Manager</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={downloadApp} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-download"></i>
                            {t.downloadApp}
                        </button>
                        <button onClick={downloadManual} className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-2">
                            <i className="fa-solid fa-file-pdf"></i>
                            {t.manual}
                        </button>
                        <button onClick={toggleLanguage} className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">{t.languageName}</button>
                        <button onClick={() => setShowContact(!showContact)} className="p-2 text-slate-400 hover:text-slate-600"><i className="fa-solid fa-circle-question text-lg"></i></button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                {showContact && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">{t.contactInfo}</span>
                        <button onClick={() => setShowContact(false)} className="text-blue-400"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 flex gap-2"><i className="fa-solid fa-box-archive text-indigo-500"></i> {editingId ? t.edit : t.storageSection}</h2>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input required name="line" value={form.line} onChange={handleInputChange} placeholder={t.cellLine} className={inputStyles} />
                                <div className="grid grid-cols-2 gap-2">
                                    <input required name="passage" value={form.passage} onChange={handleInputChange} placeholder={t.passage} className={inputStyles} />
                                    <input required name="storedBy" value={form.storedBy} onChange={handleInputChange} placeholder={t.storedBy} className={inputStyles} />
                                </div>
                                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.freezingDate}</label><input type="date" name="freezingDate" value={form.freezingDate} onChange={handleInputChange} className={inputStyles} /></div>
                                <div><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.storageDate}</label><input type="date" name="storageDate" value={form.storageDate} onChange={handleInputChange} className={inputStyles} /></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input required name="tank" value={form.tank} onChange={handleInputChange} placeholder={t.tank} className={inputStyles} />
                                    <input required name="canister" value={form.canister} onChange={handleInputChange} placeholder={t.canister} className={inputStyles} />
                                    <input required name="rack" value={form.rack} onChange={handleInputChange} placeholder={t.rack} className={inputStyles} />
                                    <input required name="position" value={form.position} onChange={handleInputChange} placeholder={t.position} className={inputStyles} />
                                </div>
                                <textarea name="comment" value={(form as any).comment} onChange={handleInputChange} placeholder={t.comments} className={textareaStyles}></textarea>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"><i className="fa-solid fa-save mr-2"></i> {t.save}</button>
                                {editingId && <button type="button" onClick={cancelEdit} className="w-full text-xs font-bold text-slate-500 mt-2 text-center block"> {t.cancel} </button>}
                            </form>
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                            <h2 className="text-sm font-bold text-slate-500 uppercase mb-4 flex gap-2"><i className="fa-solid fa-arrow-right-from-bracket text-orange-500"></i> {t.withdrawalSection}</h2>
                            <input type="text" value={withdrawSearch} onChange={e => setWithdrawSearch(e.target.value)} placeholder={t.withdrawSearchPlaceholder} className={quickWithdrawStyles} />
                            {withdrawSearchResults.length > 0 && (
                                <div className="mt-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white shadow-lg z-10">
                                    {withdrawSearchResults.map(cell => (
                                        <button key={cell.id} onClick={() => setWithdrawingCell(cell)} className="w-full p-2 text-left hover:bg-orange-50 flex justify-between items-center group">
                                            <div><div className="text-sm font-bold">{cell.line}</div><div className="text-[10px] text-slate-400">P:{cell.passage} • T:{cell.tank} Pos:{cell.position}</div></div>
                                            <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-orange-500 transition-colors"></i>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>
                    </aside>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-6">
                                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600"><i className="fa-solid fa-dna text-2xl"></i></div>
                                <div><p className="text-xs font-bold text-slate-400 uppercase">{t.totalStored}</p><p className="text-4xl font-black">{inventory.length}</p></div>
                            </div>
                            <div className="flex gap-2">
                                <label className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl cursor-pointer hover:bg-slate-200 transition-all flex items-center border border-slate-200"><i className="fa-solid fa-file-import mr-2"></i> {t.importExcel}<input type="file" className="hidden" onChange={handleImportExcel} /></label>
                                <button onClick={exportToExcel} className="px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center"><i className="fa-solid fa-file-excel mr-2"></i> {t.exportExcel}</button>
                            </div>
                        </div>

                        {stockByLine.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase flex gap-2"><i className="fa-solid fa-chart-pie text-indigo-500"></i> {t.stockOverview}</h3>
                                    {selectedLineFilter && (
                                        <button onClick={() => setSelectedLineFilter(null)} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase flex items-center gap-1">
                                            <i className="fa-solid fa-xmark"></i> {lang === 'es' ? 'Limpiar Filtro' : 'Clear Filter'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {stockByLine.map(([line, count]) => (
                                        <button 
                                            key={line} 
                                            onClick={() => handleToggleFilter(line)}
                                            className={`px-4 py-2 rounded-xl flex items-center gap-3 transition-all border ${selectedLineFilter === line ? 'bg-indigo-600 border-indigo-700 scale-105 shadow-md shadow-indigo-100' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100'}`}
                                        >
                                            <span className={`text-sm font-black transition-colors ${selectedLineFilter === line ? 'text-white' : 'text-indigo-900'}`}>{line}</span>
                                            <span className={`w-7 h-7 flex items-center justify-center text-[10px] font-black rounded-full transition-colors ${selectedLineFilter === line ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                            <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto border border-slate-200 overflow-x-auto">
                                    <button onClick={() => setViewTab('inventory')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${viewTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>{t.inventoryTab}</button>
                                    <button onClick={() => setViewTab('history')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${viewTab === 'history' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>{t.historyTab}</button>
                                    <button onClick={() => setViewTab('free')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${viewTab === 'free' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500'}`}>{t.freeSpacesTab}</button>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 z-10"></i>
                                    <input type="text" placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={searchInputStyles} />
                                </div>
                            </div>
                            {selectedLineFilter && viewTab !== 'free' && (
                                <div className="px-6 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-indigo-700">
                                        {lang === 'es' ? 'Filtrando por línea:' : 'Filtering by line:'} <span className="font-black underline">{selectedLineFilter}</span>
                                    </span>
                                    <button onClick={() => setSelectedLineFilter(null)} className="text-indigo-400 hover:text-indigo-600 transition-colors"><i className="fa-solid fa-circle-xmark"></i></button>
                                </div>
                            )}

                            {viewTab === 'free' && (
                                <div className="p-6 bg-slate-50 border-b border-slate-200">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex gap-2"><i className="fa-solid fa-plus-circle text-indigo-500"></i> {t.addFreeSpaceSection}</h3>
                                    <form onSubmit={handleFreeSpaceSubmit} className="flex flex-wrap gap-2 items-end">
                                        <div className="flex-1 min-w-[120px]">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.tank}</label>
                                            <input required name="tank" value={freeSpaceForm.tank} onChange={handleFreeSpaceInputChange} placeholder={t.tank} className={inputStyles} />
                                        </div>
                                        <div className="flex-1 min-w-[120px]">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.canister}</label>
                                            <input required name="canister" value={freeSpaceForm.canister} onChange={handleFreeSpaceInputChange} placeholder={t.canister} className={inputStyles} />
                                        </div>
                                        <div className="flex-1 min-w-[120px]">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.rack}</label>
                                            <input required name="rack" value={freeSpaceForm.rack} onChange={handleFreeSpaceInputChange} placeholder={t.rack} className={inputStyles} />
                                        </div>
                                        <div className="flex-1 min-w-[120px]">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t.position}</label>
                                            <input required name="position" value={freeSpaceForm.position} onChange={handleFreeSpaceInputChange} placeholder={t.position} className={inputStyles} />
                                        </div>
                                        <button type="submit" className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-indigo-700 transition-all shadow-sm h-[42px]"><i className="fa-solid fa-plus mr-2"></i> {t.save}</button>
                                    </form>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr>
                                            {viewTab === 'free' ? (
                                                <>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.tank}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.canister}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.rack}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.position}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">{t.actions}</th>
                                                </>
                                            ) : (
                                                <>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.cellLine}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{t.passage}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{viewTab === 'inventory' ? t.storageDate : t.withdrawalDate}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">{viewTab === 'inventory' ? t.position : (lang === 'es' ? 'Retirado por' : 'Withdrawn By')}</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">{t.actions}</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {viewTab === 'free' ? (
                                            filteredFreeSpaces.length > 0 ? (
                                                filteredFreeSpaces.map(s => (
                                                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{s.tank}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{s.canister}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{s.rack}</td>
                                                        <td className="px-6 py-4 text-sm font-black text-indigo-600">{s.position}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button onClick={() => deleteFreeSpace(s.id)} className="p-2 text-slate-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic"><i className="fa-solid fa-circle-dot text-4xl mb-4 block opacity-10"></i>{t.noData}</td></tr>
                                            )
                                        ) : (
                                            (viewTab === 'inventory' ? filteredInventory : filteredHistory).length > 0 ? (
                                                (viewTab === 'inventory' ? filteredInventory : filteredHistory).map(r => (
                                                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-bold">{r.line}</div>
                                                                {r.comment && (
                                                                    <button 
                                                                        onClick={() => openCommentModal(r)} 
                                                                        className="text-slate-300 hover:text-indigo-500 transition-colors"
                                                                        title={t.viewComment}
                                                                    >
                                                                        <i className="fa-solid fa-comment-dots text-[10px]"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="text-[10px] font-bold text-indigo-500 uppercase">{r.storedBy}</div>
                                                        </td>
                                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">{r.passage}</span></td>
                                                        <td className="px-6 py-4 text-sm text-slate-600"><div>{viewTab === 'inventory' ? r.storageDate : r.withdrawalDate}</div><div className="text-[10px] text-slate-400">F: {r.freezingDate}</div></td>
                                                        <td className="px-6 py-4 text-xs text-slate-500">{viewTab === 'inventory' ? <span>T:{r.tank} C:{r.canister} R:{r.rack} <b className="text-indigo-600">P:{r.position}</b></span> : <span className="font-semibold text-orange-600">{r.withdrawnBy}</span>}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-1">
                                                                {r.status === 'stored' && (
                                                                    <>
                                                                        <button onClick={() => startEdit(r)} className="p-2 text-slate-400 hover:text-indigo-600" title={t.edit}><i className="fa-solid fa-pen-to-square"></i></button>
                                                                        <button onClick={() => openCommentModal(r)} className="p-2 text-slate-400 hover:text-blue-500" title={t.comments}><i className="fa-solid fa-comment"></i></button>
                                                                        <button onClick={() => setWithdrawingCell(r)} className="p-2 text-slate-400 hover:text-orange-600" title={t.withdraw}><i className="fa-solid fa-arrow-right-from-bracket"></i></button>
                                                                    </>
                                                                )}
                                                                {r.status === 'withdrawn' && (
                                                                    <button onClick={() => openCommentModal(r)} className="p-2 text-slate-400 hover:text-blue-500" title={t.comments}><i className="fa-solid fa-comment"></i></button>
                                                                )}
                                                                <button onClick={() => deleteRecord(r.id)} className="p-2 text-slate-400 hover:text-red-600"><i className="fa-solid fa-trash-can"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="px-6 py-16 text-center text-slate-400 italic"><i className="fa-solid fa-box-open text-4xl mb-4 block opacity-10"></i>{t.noData}</td></tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Withdraw Modal */}
            {withdrawingCell && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in">
                        <h3 className="text-xl font-black mb-6 flex gap-3"><div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><i className="fa-solid fa-person-walking-arrow-right"></i></div> {t.withdrawTitle}</h3>
                        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200"><div className="text-sm font-bold text-slate-400 uppercase">{t.cellLine}</div><div className="text-lg font-black">{withdrawingCell.line}</div></div>
                        <form onSubmit={handleWithdraw} className="space-y-6">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">{t.whoIsWithdrawing}</label>
                                <input 
                                    autoFocus 
                                    required 
                                    value={withdrawerName} 
                                    onChange={e => setWithdrawerName(e.target.value)} 
                                    placeholder="Name..." 
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-orange-100 transition-all text-lg font-semibold text-slate-800 focus:bg-white" 
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setWithdrawingCell(null)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl transition-all hover:bg-slate-200 border border-slate-200">{t.cancel}</button>
                                <button type="submit" className="flex-[2] px-4 py-3 text-sm font-bold text-white bg-orange-600 rounded-xl shadow-lg hover:bg-orange-700 transition-all">{t.confirmWithdraw}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Comment Modal */}
            {commentModalRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in">
                        <h3 className="text-xl font-black mb-6 flex gap-3">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><i className="fa-solid fa-comment-dots"></i></div> 
                            {t.comments}
                        </h3>
                        <div className="mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="text-sm font-bold text-slate-400 uppercase">{t.cellLine}</div>
                            <div className="text-lg font-black">{commentModalRecord.line} (P: {commentModalRecord.passage})</div>
                        </div>
                        <form onSubmit={handleSaveComment} className="space-y-6">
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-2">{t.comments}</label>
                                <textarea 
                                    autoFocus
                                    value={tempComment} 
                                    onChange={e => setTempComment(e.target.value)} 
                                    placeholder="..." 
                                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-100 transition-all text-base font-medium text-slate-800 focus:bg-white min-h-[120px]" 
                                ></textarea>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="button" onClick={() => setCommentModalRecord(null)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl transition-all hover:bg-slate-200 border border-slate-200">{t.cancel}</button>
                                {commentModalRecord.comment && (
                                    <button type="button" onClick={handleDeleteComment} className="flex-1 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 rounded-xl transition-all hover:bg-red-100 border border-red-200">{t.deleteComment}</button>
                                )}
                                <button type="submit" className="flex-[2] px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all">{t.save}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <footer className="max-w-7xl mx-auto px-4 mt-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest pb-12">
                {new Date().getFullYear()} Cell Lab Manager • Lab Management System
            </footer>
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}
