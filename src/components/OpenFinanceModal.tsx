import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import { Transaction } from '../../types';
import { PluggyConnect } from 'react-pluggy-connect';
import { pluggyService } from '../services/pluggyService';

interface OpenFinanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (transactions: Partial<Transaction>[]) => void;
}

export const OpenFinanceModal: React.FC<OpenFinanceModalProps> = ({ isOpen, onClose, onImport }) => {
    const [connectToken, setConnectToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && !connectToken) {
            setLoading(true);
            pluggyService.createConnectToken()
                .then(token => {
                    setConnectToken(token);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Erro ao iniciar conexão com o banco. Verifique as chaves de API.');
                    setLoading(false);
                });
        }
    }, [isOpen]);

    const handleSuccess = async (itemData: { item: { id: string } }) => {
        try {
            setLoading(true);
            setConnectToken(null); // Hide widget

            // In a real flow, we would get accounts first, then transactions.
            // For simplicity/demo with mock/sandbox, we might need to adjust based on Pluggy's exact response structure
            // or fetch accounts for the item.id
            // Let's assume we fetch a default account or search for accounts linked to this item.

            alert(`Conexão realizada com sucesso! ID: ${itemData.item.id}. (Em produção, importaríamos os dados agora.)`);
            onClose();
        } catch (e) {
            console.error(e);
            setError('Erro ao processar dados da conexão.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <Card className="w-full max-w-lg h-[600px] flex flex-col relative animate-slide-up bg-white dark:bg-slate-900 shadow-2xl overflow-hidden rounded-3xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors z-20 bg-white/80 dark:bg-black/50 rounded-full p-1">
                    <X size={20} />
                </button>

                {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                        <AlertTriangle size={48} className="text-amber-500" />
                        <h3 className="text-lg font-bold">Falha na Conexão</h3>
                        <p className="text-muted text-sm">{error}</p>
                        <button onClick={onClose} className="text-primary font-bold">Fechar</button>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <Loader2 size={40} className="text-primary animate-spin" />
                        <p className="text-sm font-medium text-muted">Iniciando ambiente seguro...</p>
                    </div>
                ) : connectToken ? (
                    <div className="flex-1 w-full bg-white">
                        <PluggyConnect
                            connectToken={connectToken}
                            includeSandbox={true}
                            onSuccess={handleSuccess}
                            onError={(err) => setError('Erro no widget Pluggy: ' + JSON.stringify(err))}
                        />
                    </div>
                ) : null}
            </Card>
        </div>
    );
};
