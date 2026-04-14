import React, { useState } from 'react';
import { 
    MapIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, 
    ChevronDownIcon, ChevronUpIcon, InfoIcon, CheckCircleIcon,
    ZoomOutIcon, ZoomInIcon, RotateCwIcon, MaximizeIcon, PenIcon,
    SidebarIcon, MoreVerticalIcon
} from './Icons';
import { 
    ExclamationTriangleIcon, 
    ShieldCheckIcon, 
    UserIcon, 
    XCircleIcon, 
    ChatBubbleBottomCenterTextIcon, 
    DocumentCheckIcon 
} from '@heroicons/react/24/outline';

const AnalysisStep: React.FC<{ label: string; status: 'checked' | 'empty' | 'active' }> = ({ label, status }) => {
    return (
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors
            ${status === 'checked' ? 'bg-[#005c9e] text-white border-[#005c9e]' : 
              status === 'active' ? 'bg-white border-[#005c9e] text-[#005c9e] font-semibold' :
              'bg-white border-gray-300 text-gray-500 hover:border-gray-400'}`}>
            {status === 'checked' && <CheckCircleIcon className="h-4 w-4" />}
            {status === 'empty' && <div className="h-4 w-4 rounded-full border border-gray-400"></div>}
            {status === 'active' && <div className="h-4 w-4 rounded-full border-2 border-[#005c9e]"></div>}
            <span>{label}</span>
        </div>
    );
};

const PageSelector: React.FC = () => {
    const pages = [29, 10, 11, 18, 13, 18, 22, 5, 44, 12, 9, 31, 55, 60, 2];
    const [startIndex, setStartIndex] = useState(0);
    const pageSize = 6;

    const visiblePages = pages.slice(startIndex, startIndex + pageSize);
    const hasPrev = startIndex > 0;
    const hasNext = startIndex + pageSize < pages.length;

    const handlePrev = () => {
        setStartIndex(curr => Math.max(0, curr - pageSize));
    };

    const handleNext = () => {
        setStartIndex(curr => curr + pageSize);
    };

    return (
        <div className="flex items-center mt-1 text-gray-500">
            <span className="mr-1">Pags.:</span>
            <button 
                onClick={handlePrev} 
                disabled={!hasPrev}
                className={`focus:outline-none ${!hasPrev ? 'text-gray-300 cursor-default' : 'text-gray-600 hover:text-[#005c9e] cursor-pointer'}`}
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <div className="flex space-x-2 mx-1 select-none">
                {visiblePages.map((page, idx) => (
                    <span 
                        key={`${startIndex}-${idx}`} 
                        className="text-[#005c9e] font-bold cursor-pointer hover:bg-blue-50 px-0.5 rounded"
                    >
                        {page}
                    </span>
                ))}
            </div>
            <button 
                onClick={handleNext} 
                disabled={!hasNext}
                className={`focus:outline-none ${!hasNext ? 'text-gray-300 cursor-default' : 'text-gray-600 hover:text-[#005c9e] cursor-pointer'}`}
            >
                <ChevronRightIcon className="h-4 w-4" />
            </button>
        </div>
    );
};

const ExemplifiedAnalysis: React.FC = () => {
    const [zoomLevel, setZoomLevel] = useState(75);
    const [currentSectionOpen, setCurrentSectionOpen] = useState(true);

    return (
        <div className="flex flex-col h-full bg-[#f0f2f5] min-h-[calc(100vh-64px)]">
            {/* Top Bar / Breadcrumbs / Status */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center shadow-sm">
                <div className="text-sm">
                    <span className="text-[#005c9e] font-medium cursor-pointer">Análise</span>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <span className="text-[#005c9e] font-medium cursor-pointer">Documentos de análises</span>
                    <span className="mx-2 text-gray-400">&gt;</span>
                    <span className="text-gray-800 font-bold">114791_9001318223123_53167_0000002100063_1.pdf</span>
                </div>
                <button className="bg-gray-100 text-[#005c9e] px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                    Em Análise Completa
                </button>
            </div>

            {/* Toolbar & Stepper */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center space-x-4 shadow-sm z-10">
                <button className="bg-[#005c9e] text-white px-3 py-2 rounded-md flex items-center space-x-2 text-sm font-medium hover:bg-[#004a7c]">
                    <MapIcon className="h-4 w-4" />
                    <span>Mapas</span>
                </button>
                <button className="bg-[#005c9e] text-white p-2 rounded-md hover:bg-[#004a7c]">
                    <SearchIcon className="h-5 w-5" />
                </button>
                
                <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>

                {/* Horizontal Scrollable Tabs */}
                <div className="flex-grow overflow-x-auto no-scrollbar">
                    <div className="flex items-center space-x-2 min-w-max pb-1">
                        {/* Group: Análise Simplificada */}
                        <div className="relative border border-gray-300 rounded-full px-1 py-1 flex items-center space-x-2 bg-gray-50">
                            <span className="absolute -top-3 left-4 bg-white px-1 text-[10px] text-gray-500 font-medium">Análise Simplificada</span>
                            <AnalysisStep label="Diagnóstico Rápido" status="empty" />
                            <AnalysisStep label="Existência do financiamento" status="checked" />
                            <AnalysisStep label="OR/CADMUT" status="empty" />
                            <AnalysisStep label="Contribuição" status="empty" />
                            <AnalysisStep label="Mudança de Devedor" status="empty" />
                            <AnalysisStep label="Índices de Reajuste" status="empty" />
                        </div>

                         {/* Group: Análise Completa */}
                        <div className="relative border border-gray-300 rounded-full px-1 py-1 flex items-center space-x-2 bg-gray-50 ml-2">
                             <span className="absolute -top-3 left-4 bg-white px-1 text-[10px] text-gray-500 font-medium">Análise Completa</span>
                             <AnalysisStep label="Aspectos Formais" status="checked" />
                             {/* Mock hidden overflow */}
                             <div className="w-8"></div> 
                        </div>
                    </div>
                </div>

                 <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 shadow-sm border border-gray-200 bg-white">
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>

            {/* Main Split Content */}
            <div className="flex flex-grow overflow-hidden">
                {/* Left Panel: Analysis Form */}
                <div className="w-1/3 min-w-[350px] max-w-[500px] bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
                    {/* Metadata Table */}
                    <div className="p-4">
                        <div className="bg-gray-100 rounded-md overflow-hidden">
                            <div className="grid grid-cols-4 bg-gray-200 text-xs font-bold text-gray-600 border-b border-gray-300">
                                <div className="p-2">Ag. Financeiro</div>
                                <div className="p-2">Contrato</div>
                                <div className="p-2">Mutuário</div>
                                <div className="p-2">Categoria</div>
                            </div>
                            <div className="grid grid-cols-4 text-xs text-gray-700">
                                <div className="p-2 border-r border-gray-200">53167</div>
                                <div className="p-2 border-r border-gray-200">0000002100063</div>
                                <div className="p-2 border-r border-gray-200 font-medium text-[#005c9e]">MANOELA LEDESMA MONTEIRO</div>
                                <div className="p-2">Pedido Reanálise</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200"></div>

                    <div className="px-4 pb-4 pt-4 space-y-4">
                        {/* Question Accordion */}
                        <div className="border border-gray-200 rounded-md overflow-hidden">
                            <button 
                                onClick={() => setCurrentSectionOpen(!currentSectionOpen)}
                                className="w-full flex justify-between items-center bg-[#fffcf5] px-4 py-3 hover:bg-[#fff8e6] transition-colors border-b border-gray-200"
                            >
                                <div className="flex items-center space-x-2">
                                    <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                                    <span className="font-medium text-sm text-[#8c5a15] uppercase">78 - EXISTÊNCIA DO FINANCIAMENTO - Imóvel Comercial</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="bg-red-100 text-[#d32f2f] text-xs font-bold px-2 py-1 rounded">NÃO APROVADO</span>
                                    {currentSectionOpen ? <ChevronUpIcon className="h-4 w-4 text-gray-500" /> : <ChevronDownIcon className="h-4 w-4 text-gray-500" />}
                                </div>
                            </button>

                            {currentSectionOpen && (
                                <div className="p-4 bg-white space-y-4">
                                    {/* Camada de Controle */}
                                    <div className="bg-[#f8fbff] border border-blue-100 rounded-md p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <ShieldCheckIcon className="h-4 w-4 text-[#005c9e]" />
                                            <span className="text-xs font-bold text-[#005c9e] uppercase tracking-wider">Camada de Controle</span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Verificar se o imóvel comercial possui registro de financiamento ativo conforme normas vigentes.
                                        </p>
                                    </div>

                                    {/* Justificativa do Analista */}
                                    <div className="bg-white border border-gray-200 rounded-md p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <UserIcon className="h-4 w-4 text-[#005c9e]" />
                                            <span className="text-xs font-bold text-[#005c9e] uppercase tracking-wider">Justificativa do Analista</span>
                                        </div>
                                        <p className="text-sm text-gray-600 italic">
                                            "O analista identificou que o registro está pendente de atualização no sistema central, impossibilitando a validação imediata."
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3">
                                        <button className="flex-1 flex items-center justify-center space-x-2 bg-[#f0f4f8] hover:bg-[#e2e8f0] text-[#334155] py-2 rounded-md font-medium transition-colors">
                                            <span>Aceito</span>
                                            <CheckCircleIcon className="h-5 w-5" />
                                        </button>
                                        <button className="flex-1 flex items-center justify-center space-x-2 bg-[#e11d48] hover:bg-[#be123c] text-white py-2 rounded-md font-medium transition-colors">
                                            <span>Não Aprovado</span>
                                            <XCircleIcon className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Parecer do Supervisor */}
                                    <div className="bg-[#fff5f5] border border-red-200 rounded-md p-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-[#e11d48]" />
                                            <span className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">Parecer do Supervisor</span>
                                        </div>
                                        <textarea 
                                            className="w-full bg-white border border-gray-200 rounded-md p-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-300 resize-none"
                                            rows={3}
                                            defaultValue="Não aprovado"
                                        ></textarea>
                                    </div>

                                    {/* Salvar Item Button */}
                                    <div className="flex justify-end pt-2">
                                        <button className="flex items-center space-x-2 bg-[#1e293b] hover:bg-[#0f172a] text-white px-4 py-2 rounded-md font-medium transition-colors">
                                            <span>Salvar Item</span>
                                            <DocumentCheckIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: PDF Viewer */}
                <div className="flex-grow bg-gray-800 flex flex-col relative">
                    {/* PDF Toolbar */}
                    <div className="bg-[#2d3748] text-gray-300 h-12 flex items-center justify-between px-4 shadow-md z-10">
                        <div className="flex items-center space-x-4">
                            <button className="hover:text-white"><SidebarIcon className="h-5 w-5" /></button>
                        </div>

                        <div className="flex items-center space-x-2 bg-gray-700 rounded-md px-2 py-1">
                            <span className="bg-[#005c9e] text-white px-2 py-0.5 rounded text-xs">1</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-xs">66</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))} className="hover:text-white"><ZoomOutIcon className="h-5 w-5" /></button>
                            <span className="text-sm min-w-[3rem] text-center bg-gray-700 px-2 rounded">{zoomLevel}%</span>
                            <button onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))} className="hover:text-white"><ZoomInIcon className="h-5 w-5" /></button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="hover:text-white"><RotateCwIcon className="h-5 w-5" /></button>
                            <button className="hover:text-white"><MaximizeIcon className="h-5 w-5" /></button>
                            <button className="hover:text-white"><PenIcon className="h-4 w-4" /></button>
                             <div className="w-px h-6 bg-gray-600"></div>
                            <button className="hover:text-white"><div className="flex flex-col space-y-[2px]"><div className="w-4 h-0.5 bg-current"></div><div className="w-4 h-0.5 bg-current"></div><div className="w-4 h-0.5 bg-current"></div></div></button>
                             <button className="hover:text-white"><MoreVerticalIcon className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* PDF Content Area (Mock) */}
                    <div className="flex-grow overflow-auto flex justify-center p-8 bg-[#525659]">
                        <div 
                            className="bg-white shadow-2xl transition-all duration-200 ease-out origin-top"
                            style={{ 
                                width: `${zoomLevel * 8}px`, 
                                height: `${zoomLevel * 11}px`, // Aspect ratio A4 approx
                                minWidth: '400px',
                                minHeight: '560px'
                            }}
                        >
                            {/* Simulated Scanned Doc Content */}
                            <div className="p-10 h-full w-full flex flex-col font-serif text-gray-800 text-[10px] sm:text-xs leading-relaxed select-none pointer-events-none opacity-80">
                                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
                                    <div className="w-16 h-16 bg-gray-300"></div> {/* Logo Placeholder */}
                                    <div className="text-right">
                                        <h1 className="font-bold text-sm uppercase">Companhia de Habitação Popular</h1>
                                        <p>Mato Grosso do Sul - COHAB-MS</p>
                                    </div>
                                </div>
                                
                                <h2 className="text-center font-bold text-sm mb-6">CONTRATO DE PROMESSA DE COMPRA E VENDA, NA FORMA ABAIXO DISCRIMINADA:</h2>
                                
                                <p className="mb-4 text-justify">
                                    Pelo presente instrumento particular, com força de escritura pública, "ex-vi" do art. 1.º da Lei n.º 5.049, de 29.06.1966, e na melhor forma de direito, como <strong>PROMITENTE VENDEDORA</strong>, a empresa pública nomeada e qualificada no item 1 do quadro-resumo constante do presente instrumento, neste ato representada pelos seus Diretores nomeados e qualificados no item 2 do quadro-resumo, neste contrato denominada COHAB-MS, e de outro lado como <strong>PROMITENTE(S) COMPRADOR(ES)</strong> nomeado(s) e qualificado(s) no item 3 do quadro-resumo, têm entre si ajustado o presente contrato mediante as seguintes cláusulas e condições:
                                </p>

                                <p className="mb-4 text-justify">
                                    <strong>CLÁUSULA PRIMEIRA</strong> - A COHAB-MS declara que é justo título é senhora e legítima possuidora do imóvel discriminado no item 4 do quadro-resumo, por construção própria devidamente averbada à margem do título aquisitivo e constituído das dependências constantes do item 5 do quadro-resumo e do lote de terreno respectivo, cujas medidas, área e limitações constam do item 6 do quadro-resumo, nos termos da escritura pública de compra e venda discriminada no item 7 do quadro-resumo.
                                </p>
                                
                                <p className="mb-4 text-justify">
                                     <strong>CLÁUSULA SEGUNDA</strong> - Possuindo o imóvel livre e desembaraçado de todo e qualquer ônus, salvo hipoteca constituída em favor do BANCO NACIONAL DA HABITAÇÃO, conforme registro discriminado no item 8 do quadro-resumo, a COHAB-MS, pelo presente instrumento promete e se obriga a vendê-lo ao(s) PROMITENTE(S) COMPRADOR(ES), com todas as suas benfeitorias, mediante o preço atual, equivalência em UPC (Unidade Padrão de Capital) do BANCO NACIONAL DA HABITAÇÃO, constante do item 9 do quadro-resumo.
                                </p>

                                 <p className="mb-4 text-justify">
                                    <strong>CLÁUSULA TERCEIRA</strong> - O(s) PROMITENTE(S) COMPRADOR(ES) pagará(ão) o financiamento no prazo constante do item 10 do quadro-resumo, calculados de conformidade com as disposições da R/BNH n.º 81/80. As taxas de juros discriminadas no item...
                                </p>

                                {/* Signature lines mock */}
                                <div className="mt-auto pt-10 flex justify-between px-10">
                                     <div className="border-t border-black w-1/3 text-center pt-1">Vendedora</div>
                                     <div className="border-t border-black w-1/3 text-center pt-1">Comprador</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExemplifiedAnalysis;
