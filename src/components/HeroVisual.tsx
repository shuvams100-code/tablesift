import { CheckCircle2, FileSpreadsheet, Zap } from "lucide-react";

export default function HeroVisual() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1200px' }}>

            {/* --- LAYER 1: THE BASE SPREADSHEET --- */}
            <div className="glass-panel" style={{
                width: '100%',
                maxWidth: '600px',
                height: '350px',
                transform: 'rotateY(-15deg) rotateX(10deg) rotateZ(2deg)',
                transformStyle: 'preserve-3d',
                overflow: 'hidden',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(16, 124, 65, 0.2)',
                boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15), 0 0 20px rgba(16, 124, 65, 0.05)'
            }}>
                {/* Spreadsheet Header */}
                <div style={{ padding: '20px', backgroundColor: '#107c41', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <FileSpreadsheet size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>financial_data_extract.xlsx</span>
                </div>

                {/* Spreadsheet Body (Grid) */}
                <div style={{ padding: '16px' }}>
                    {/* Excel Header row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: '1px', backgroundColor: '#e2e8f0', borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                        {['#', 'Transaction', 'Category', 'Volume'].map((h, i) => (
                            <div key={i} style={{ backgroundColor: '#f8fafc', padding: '8px 12px', fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{h}</div>
                        ))}
                    </div>
                    {/* Skeleton Rows */}
                    {[1, 2, 3, 4, 5, 6].map((row) => (
                        <div key={row} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ padding: '10px 12px', color: '#cbd5e1', fontSize: '0.65rem', fontWeight: 700 }}>{row}</div>
                            <div style={{ padding: '10px 12px' }}><div style={{ height: '6px', width: '70%', background: '#f1f5f9', borderRadius: '3px' }}></div></div>
                            <div style={{ padding: '10px 12px' }}><div style={{ height: '6px', width: '50%', background: '#dcfce7', borderRadius: '3px' }}></div></div>
                            <div style={{ padding: '10px 12px' }}><div style={{ height: '6px', width: '30%', background: '#f1f5f9', borderRadius: '3px' }}></div></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- LAYER 2: FLOATING WIDGETS --- */}

            {/* Widget A: Upload Complete (Top Right) */}
            <div className="animate-float" style={{
                position: 'absolute',
                top: '40px',
                right: '40px',
                backgroundColor: '#ffffff',
                padding: '12px 20px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #f0fdf4',
                zIndex: 10
            }}>
                <div style={{ backgroundColor: '#dcfce7', padding: '6px', borderRadius: '50%', color: '#107C41' }}>
                    <CheckCircle2 size={18} />
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Upload Complete</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#22c55e' }}>Success</div>
                </div>
            </div>

            {/* Widget B: Processing (Bottom Left) */}
            <div className="animate-float-delayed glass-panel" style={{
                position: 'absolute',
                bottom: '100px',
                left: '20px',
                padding: '20px',
                width: '240px',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>Processing PDF...</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#107C41' }}>75%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(16, 124, 65, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', background: '#107C41', boxShadow: '0 0 10px rgba(16, 124, 65, 0.4)' }}></div>
                </div>
            </div>

            {/* Widget C: Data Extracted Tag (Center) */}
            <div className="animate-float" style={{
                position: 'absolute',
                top: '50%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 5
            }}>
                <Zap size={14} fill="#22c55e" stroke="none" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Data Extracted</span>
            </div>

        </div>
    );
}
