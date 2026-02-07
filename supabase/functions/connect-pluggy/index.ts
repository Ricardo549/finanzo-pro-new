import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { action, body } = await req.json();
        const PLUGGY_API_URL = 'https://api.pluggy.ai';
        const clientId = Deno.env.get('PLUGGY_CLIENT_ID');
        const clientSecret = Deno.env.get('PLUGGY_CLIENT_SECRET');

        if (!clientId || !clientSecret) {
            throw new Error('Missing Pluggy keys in Edge Function env');
        }

        if (action === 'getAccessToken') {
            const response = await fetch(`${PLUGGY_API_URL}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, clientSecret }),
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (action === 'createConnectToken') {
            // First get auth token
            const authResponse = await fetch(`${PLUGGY_API_URL}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, clientSecret }),
            });
            const authData = await authResponse.json();
            const apiKey = authData.apiKey;

            const response = await fetch(`${PLUGGY_API_URL}/connect_token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': apiKey
                },
                body: JSON.stringify(body || {}),
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        if (action === 'fetchTransactions') {
            // First get auth token
            const authResponse = await fetch(`${PLUGGY_API_URL}/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientId, clientSecret }),
            });
            const authData = await authResponse.json();
            const apiKey = authData.apiKey;

            const queryString = new URLSearchParams(body).toString();
            const response = await fetch(`${PLUGGY_API_URL}/transactions?${queryString}`, {
                method: 'GET',
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            const data = await response.json();
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
