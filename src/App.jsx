import React, { useState, useEffect } from 'react';

const Icons = {
    Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>,
    Code: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>,
    Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    Bank: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
};

const NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Sam", "Jamie", "Drew"];
const SURNAMES = ["Smith", "Doe", "Williams", "Chen", "Garcia", "Kim", "Patel", "Wright"];

const App = () => {
    const [activeApp, setActiveApp] = useState(null);
    const [toast, setToast] = useState(null);
    
    const [company, setCompany] = useState({ name: "Quantum Inc.", week: 1, capital: 5000, equity: 100, tier: 1, capacity: 3 });
    const [player, setPlayer] = useState({ energy: 100, burnout: 0, coding: 10, marketing: 5 });
    const [product, setProduct] = useState({ quality: 1.0, users: 0, hype: 0 });
    
    const [employees, setEmployees] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [inbox, setInbox] = useState([
        { id: 1, sender: "System", subject: "Garage Days", body: "Build your product, run marketing, and grow your user base. When you have $15,000, upgrade your office to hire a team." }
    ]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
    const formatMoney = (num) => '$' + Math.floor(num).toLocaleString();
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const generateApplicant = (currentTier) => {
        let roles = ['Engineer', 'Marketer'];
        if (currentTier >= 3) roles.push('Lawyer', 'HR Rep', 'Manager');
        
        const role = roles[Math.floor(Math.random() * roles.length)];
        let eng = Math.floor(Math.random() * 5);
        let cha = Math.floor(Math.random() * 5);
        let log = Math.floor(Math.random() * 5);
        let mgt = Math.floor(Math.random() * 5);
        
        if (role === 'Engineer') eng += 15;
        if (role === 'Marketer') cha += 15;
        if (role === 'Lawyer') log += 15;
        if (role === 'HR Rep') mgt += 15;
        if (role === 'Manager') { mgt += 10; cha += 5; log += 5; }

        return {
            id: generateId(),
            name: `${NAMES[Math.floor(Math.random()*NAMES.length)]} ${SURNAMES[Math.floor(Math.random()*SURNAMES.length)]}`,
            role: role,
            engineering: eng,
            charisma: cha,
            logic: log,
            management: mgt,
            salary: Math.floor(Math.random() * 600) + 600
        };
    };

    const generateContract = () => {
        const isAdvanced = Math.random() > 0.6 && company.tier >= 2;
        
        if (isAdvanced) {
            const types = [
                { t: "Corporate Audit", s: "logic", req: 30 },
                { t: "Enterprise Architecture", s: "engineering", req: 40 },
                { t: "Global PR Crisis", s: "charisma", req: 35 }
            ];
            const selected = types[Math.floor(Math.random()*types.length)];
            return {
                id: generateId(),
                title: selected.t,
                reward: Math.floor(Math.random() * 5000) + 3000,
                type: 'team',
                reqStat: selected.s,
                reqAmt: selected.req
            };
        } else {
            const types = ["Build a Restaurant App", "Fix Legacy Database", "SEO Campaign for Local Gym"];
            return {
                id: generateId(),
                title: types[Math.floor(Math.random()*types.length)],
                reward: Math.floor(Math.random() * 2000) + 1000,
                type: 'ap',
                energyCost: 40
            };
        }
    };

    const getTeamStats = () => {
        let s = { eng: 0, cha: 0, log: 0, mgt: 0 };
        employees.forEach(e => {
            s.eng += e.engineering; s.cha += e.charisma; s.log += e.logic; s.mgt += e.management;
        });
        return s;
    };

    const playerWork = (type) => {
        if (player.energy < 20) { showToast("Not enough Energy! You need to Rest."); return; }
        const penalty = 1 - (player.burnout / 200); 
        
        if (type === 'code') {
            const gain = (Math.random() * player.coding * penalty * 0.5).toFixed(2);
            setProduct(p => ({ ...p, quality: parseFloat((p.quality + parseFloat(gain)).toFixed(2)) }));
            showToast(`Coded hard. Quality +${gain}`);
        } else if (type === 'market') {
            const gain = Math.floor(Math.random() * player.marketing * penalty * 2) + 1;
            setProduct(p => ({ ...p, hype: p.hype + gain }));
            showToast(`Marketing campaign. Hype +${gain}`);
        }
        setPlayer(p => ({ ...p, energy: p.energy - 20, burnout: p.energy <= 30 ? Math.min(100, p.burnout + 10) : p.burnout }));
    };

    const takeContract = (contract) => {
        if (contract.type === 'ap') {
            if(player.energy < contract.energyCost) { showToast(`Need ${contract.energyCost} Energy.`); return; }
            setCompany(c => ({...c, capital: c.capital + contract.reward}));
            setPlayer(p => ({...p, energy: p.energy - contract.energyCost}));
        } else if (contract.type === 'team') {
            const stats = getTeamStats();
            const statMap = { 'engineering': stats.eng, 'logic': stats.log, 'charisma': stats.cha };
            if(statMap[contract.reqStat] < contract.reqAmt) {
                showToast(`Your team lacks the required ${contract.reqStat} (${statMap[contract.reqStat]}/${contract.reqAmt})`);
                return;
            }
            setCompany(c => ({...c, capital: c.capital + contract.reward}));
        }
        
        setContracts(prev => prev.filter(c => c.id !== contract.id));
        showToast(`Contract completed: +${formatMoney(contract.reward)}`);
    };

    const hireEmployee = (applicant) => {
        if(employees.length >= company.capacity) { showToast("Office is at max capacity!"); return; }
        setEmployees(prev => [...prev, applicant]);
        setApplicants(prev => prev.filter(a => a.id !== applicant.id));
        showToast(`Hired ${applicant.name} as ${applicant.role}`);
    };

    const upgradeOffice = () => {
        if (company.tier === 1 && company.capital >= 15000) {
            setCompany(c => ({ ...c, capital: c.capital - 15000, tier: 2, capacity: 15 }));
            setApplicants([generateApplicant(2), generateApplicant(2)]);
            setInbox(prev => [{ id: generateId(), sender: "HR System", subject: "Recruitment Unlocked", body: "You now have the space to hire employees. Check the Team app." }, ...prev]);
            showToast("Upgraded to Co-Working Space!");
        }
        else if (company.tier === 2 && company.capital >= 50000) {
            setCompany(c => ({ ...c, capital: c.capital - 50000, tier: 3, capacity: 50 }));
            setInbox(prev => [{ id: generateId(), sender: "System", subject: "Corporate Era", body: "Welcome to your Corporate Office! HR and Legal branches are now unlocked. Lawyers will reduce your server costs through negotiation, and HR Reps will increase your weekly applicant pool." }, ...prev]);
            showToast("Upgraded to Corporate Office!");
        }
        else if (company.tier === 3 && company.capital >= 250000) {
            setCompany(c => ({ ...c, capital: c.capital - 250000, tier: 4, capacity: 150 }));
            setInbox(prev => [{ id: generateId(), sender: "System", subject: "The Skyscraper", body: "You now own a skyscraper. Scale your workforce to the moon." }, ...prev]);
            showToast("Upgraded to The Skyscraper!");
        }
    };

    const advanceWeek = () => {
        const teamStats = getTeamStats();
        let addedQuality = 0;
        let addedHype = 0;
        let payroll = 0;

        const mgtMultiplier = 1 + (teamStats.mgt * 0.01);

        employees.forEach(emp => {
            payroll += emp.salary;
            if(emp.role === 'Engineer') addedQuality += (emp.engineering * 0.05 * mgtMultiplier);
            if(emp.role === 'Marketer') addedHype += (emp.charisma * 0.5 * mgtMultiplier);
        });

        const newQuality = parseFloat((product.quality + addedQuality).toFixed(2));
        const newHypeObj = product.hype + Math.floor(addedHype);
        
        const newUsers = Math.floor(newHypeObj * newQuality * (Math.random() * 0.5 + 0.5));
        const totalUsers = product.users + newUsers;

        const legalDiscount = Math.min(0.5, teamStats.log * 0.01);
        const baseServerCost = totalUsers * 0.02;
        const finalServerCost = baseServerCost * (1 - legalDiscount);

        const netProfit = (totalUsers * 0.10) - finalServerCost - payroll;
        
        const newCapital = company.capital + netProfit;
        if (newCapital < 0) { alert("BANKRUPT! Game Over."); window.location.reload(); return; }

        setProduct({ quality: newQuality, users: totalUsers, hype: Math.max(0, Math.floor(newHypeObj * 0.7)) });
        setCompany(c => ({ ...c, capital: newCapital, week: c.week + 1 }));
        setPlayer(p => ({ ...p, energy: 100, burnout: Math.max(0, p.burnout - 10) }));
        
        if (company.tier >= 2) {
            let numApplicants = 3 + Math.floor(teamStats.mgt / 20);
            let newApps = [];
            for(let i=0; i<numApplicants; i++) newApps.push(generateApplicant(company.tier));
            setApplicants(newApps);
        }
        setContracts([generateContract(), generateContract(), generateContract()]);

        let newEvents = [];
        if (company.week === 10) newEvents.push({ id: generateId(), sender: "TechCrunch", subject: "New Startup: Apex Dynamics", body: "A well-funded competitor, Apex Dynamics, has just launched a product very similar to yours." });
        if (company.week > 15 && employees.length > 0 && Math.random() > 0.8) {
            const target = employees[Math.floor(Math.random() * employees.length)];
            newEvents.push({ id: generateId(), sender: target.name, subject: "Resignation", body: `I've been offered double my salary by Apex Dynamics. I'm leaving.` });
            setEmployees(prev => prev.filter(e => e.id !== target.id));
        }

        setInbox(prev => [...newEvents, ...prev]);
        showToast(`Week Completed. Net: ${formatMoney(netProfit)}. Payroll: ${formatMoney(payroll)}`);
    };

    const WindowApp = ({ title, onClose, children }) => (
        <div className="window">
            <div className="window-header">
                <div className="window-controls"><div className="dot red" onClick={onClose}></div><div className="dot yellow"></div><div className="dot green"></div></div>
                <div className="text-slate-400 text-sm font-semibold uppercase">{title}</div>
                <div className="w-12"></div>
            </div>
            <div className="window-content">{children}</div>
        </div>
    );

    const [teamTab, setTeamTab] = useState('overview');
    const [finTab, setFinTab] = useState('equity');

    return (
        <div className="desktop-bg">
            <div className="absolute top-0 left-0 w-full h-8 bg-black/50 text-xs text-slate-300 flex justify-between items-center px-6 z-40 backdrop-blur-md">
                <div className="font-bold flex gap-4"><span>{company.name} // Tier {company.tier}</span><span>Week {company.week}</span></div>
                <div className="flex gap-6 font-mono">
                    <span className="text-green-400">Cash: {formatMoney(company.capital)}</span>
                    <span className="text-purple-400">Equity: {company.equity}%</span>
                    <span className="text-yellow-400">Energy: {player.energy}/100</span>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
                {activeApp === 'mail' && (
                    <WindowApp title="Mail Client" onClose={() => setActiveApp(null)}>
                        <div className="p-6 space-y-4">
                            {inbox.map(msg => (
                                <div key={msg.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-white">{msg.subject}</h3>
                                        <span className="text-xs text-slate-400">From: {msg.sender}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{msg.body}</p>
                                </div>
                            ))}
                        </div>
                    </WindowApp>
                )}

                {activeApp === 'product' && (
                    <WindowApp title="Product Dashboard" onClose={() => setActiveApp(null)}>
                        <div className="p-6 grid grid-cols-2 gap-6 h-full">
                            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-osaccent mb-6">Core Metrics</h2>
                                    <div className="space-y-4 font-mono text-sm">
                                        <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Quality Score</span><span className="text-white font-bold">{product.quality}</span></div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Active Users</span><span className="text-green-400 font-bold">{product.users.toLocaleString()}</span></div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2"><span className="text-slate-500">Current Hype</span><span className="text-yellow-400 font-bold">{product.hype}</span></div>
                                    </div>
                                </div>
                                <div className="bg-slate-800 p-4 rounded text-sm mt-8 border border-slate-700">
                                    <div className="flex justify-between text-slate-400 mb-1">
                                        <span>Weekly Server Costs</span>
                                        {getTeamStats().log > 0 && <span className="text-green-400 text-xs">Legal Discount: -{(Math.min(0.5, getTeamStats().log * 0.01) * 100).toFixed(0)}%</span>}
                                    </div>
                                    <div className="text-red-400 font-bold font-mono">-{formatMoney((product.users * 0.02) * (1 - Math.min(0.5, getTeamStats().log * 0.01)))}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm mb-4">
                                    <div className="flex justify-between mb-1"><span>Your Energy</span><span className="text-yellow-400 font-bold">{player.energy} AP</span></div>
                                    <div className="w-full bg-slate-900 rounded-full h-1.5 mb-3"><div className="bg-yellow-400 h-1.5 rounded-full" style={{width: `${player.energy}%`}}></div></div>
                                    <div className="flex justify-between mb-1"><span>Burnout (Reduces Effectiveness)</span><span className="text-red-400 font-bold">{player.burnout}%</span></div>
                                    <div className="w-full bg-slate-900 rounded-full h-1.5"><div className="bg-red-500 h-1.5 rounded-full" style={{width: `${player.burnout}%`}}></div></div>
                                </div>
                                <button onClick={() => playerWork('code')} className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg font-bold flex justify-between items-center transition-colors">
                                    <span>Manual Coding</span><span className="text-yellow-400 text-xs">-20 AP</span>
                                </button>
                                <button onClick={() => playerWork('market')} className="bg-slate-700 hover:bg-slate-600 text-white p-4 rounded-lg font-bold flex justify-between items-center transition-colors">
                                    <span>Manual Marketing</span><span className="text-yellow-400 text-xs">-20 AP</span>
                                </button>
                                <button onClick={advanceWeek} className="mt-auto w-full bg-osaccent hover:bg-blue-400 text-slate-900 p-4 rounded-lg font-bold text-lg transition-all">
                                    Rest & Advance Week ➔
                                </button>
                            </div>
                        </div>
                    </WindowApp>
                )}

                {activeApp === 'team' && (
                    <WindowApp title="Team & HR" onClose={() => setActiveApp(null)}>
                        <div className="inner-tabs">
                            <div className={`inner-tab ${teamTab === 'overview' ? 'active' : ''}`} onClick={()=>setTeamTab('overview')}>My Team</div>
                            <div className={`inner-tab ${teamTab === 'hr' ? 'active' : ''}`} onClick={()=>setTeamTab('hr')}>Recruitment (HR)</div>
                            <div className={`inner-tab ${teamTab === 'office' ? 'active' : ''}`} onClick={()=>setTeamTab('office')}>Office Mgmt</div>
                        </div>
                        <div className="p-6 overflow-y-auto h-full">
                            {teamTab === 'overview' && (
                                <div>
                                    <div className="mb-6 flex justify-between items-end border-b border-slate-700 pb-2">
                                        <h2 className="text-xl font-bold">Active Roster</h2>
                                        <span className="text-slate-400 text-sm">Capacity: {employees.length} / {company.capacity}</span>
                                    </div>
                                    {employees.length === 0 ? <p className="text-slate-500">You are flying solo. Upgrade office to hire.</p> : (
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                            {employees.map(emp => (
                                                <div key={emp.id} className="bg-slate-800 p-4 rounded border border-slate-700">
                                                    <div className="font-bold text-white">{emp.name}</div>
                                                    <div className="text-xs text-osaccent mb-2 font-bold">{emp.role}</div>
                                                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono bg-slate-900 p-2 round
                                                   <span>Eng: <span className="text-white">{app.engineering}</span></span>
                                                            <span>Cha: <span className="text-white">{app.charisma}</span></span>
                                                            <span>Log: <span className="text-white">{app.logic}</span></span>
                                                            <span>Mgt: <span className="text-white">{app.management}</span></span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-mono text-red-400 text-sm mb-2">Asks: {formatMoney(app.salary)}/wk</div>
                                                        <button onClick={()=>hireEmployee(app)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-sm font-bold">Hire</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {teamTab === 'office' && (
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold mb-2">Current: Tier {company.tier}</h2>
                                    <p className="text-slate-400 mb-8">Capacity: {company.capacity} Employees</p>
                                    
                                    {company.tier === 1 && (
                                        <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-auto border border-slate-700">
                                            <h3 className="font-bold text-lg mb-2">Upgrade to Co-Working Space (Tier 2)</h3>
                                            <p className="text-sm text-slate-400 mb-4">Unlocks HR Recruitment and increases capacity to 15.</p>
                                            <button onClick={upgradeOffice} className={`w-full py-3 rounded font-bold ${company.capital >= 15000 ? 'bg-osaccent text-slate-900' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                                                {company.capital >= 15000 ? 'Pay $15,000' : 'Insufficient Funds'}
                                            </button>
                                        </div>
                                    )}
                                    {company.tier === 2 && (
                                        <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-auto border border-slate-700">
                                            <h3 className="font-bold text-lg mb-2">Upgrade to Corporate Office (Tier 3)</h3>
                                            <p className="text-sm text-slate-400 mb-4">Unlocks Lawyers, HR Reps, and Managers. Capacity: 50.</p>
                                            <button onClick={upgradeOffice} className={`w-full py-3 rounded font-bold ${company.capital >= 50000 ? 'bg-osaccent text-slate-900' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                                                {company.capital >= 50000 ? 'Pay $50,000' : 'Insufficient Funds'}
                                            </button>
                                        </div>
                                    )}
                                    {company.tier === 3 && (
                                        <div className="bg-slate-800 p-6 rounded-lg max-w-md mx-auto border border-slate-700">
                                            <h3 className="font-bold text-lg mb-2">Upgrade to The Skyscraper (Tier 4)</h3>
                                            <p className="text-sm text-slate-400 mb-4">Massive enterprise scaling. Capacity: 150.</p>
                                            <button onClick={upgradeOffice} className={`w-full py-3 rounded font-bold ${company.capital >= 250000 ? 'bg-osaccent text-slate-900' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                                                {company.capital >= 250000 ? 'Pay $250,000' : 'Insufficient Funds'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </WindowApp>
                )}

                {activeApp === 'finance' && (
                    <WindowApp title="Financial Operations" onClose={() => setActiveApp(null)}>
                        <div className="inner-tabs">
                            <div className={`inner-tab ${finTab === 'equity' ? 'active' : ''}`} onClick={()=>setFinTab('equity')}>Equity & VC</div>
                            <div className={`inner-tab ${finTab === 'b2b' ? 'active' : ''}`} onClick={()=>setFinTab('b2b')}>B2B Contracts</div>
                        </div>
                        <div className="p-6 h-full">
                            {finTab === 'equity' && (
                                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center max-w-lg mx-auto mt-4">
                                    <h2 className="text-2xl font-bold mb-2">Pitch Venture Capital</h2>
                                    <p className="text-slate-400 text-sm mb-6">Valuation is based on Users and Quality.</p>
                                    <div className="flex justify-around mb-6 p-4 bg-slate-900 rounded font-mono text-sm border border-slate-800">
                                        <div><div className="text-slate-500">Est. Valuation</div><div className="text-green-400 font-bold text-lg">{formatMoney((product.users * 50) + (product.quality * 1000) + 10000)}</div></div>
                                        <div><div className="text-slate-500">Your Equity</div><div className="text-purple-400 font-bold text-lg">{company.equity}%</div></div>
                                    </div>
                                    <button onClick={()=>{
                                        if (player.energy < 40) { showToast("Need 40 Energy."); return; }
                                        const val = (product.users * 50) + (product.quality * 1000) + 10000; 
                                        if (val < 2000) { showToast("Investors rejected you."); return; }
                                        setCompany(c => ({...c, capital: c.capital + (val * 0.10), equity: c.equity - 10}));
                                        setPlayer(p => ({...p, energy: p.energy - 40}));
                                        showToast(`Sold 10% for ${formatMoney(val * 0.10)}`);
                                    }} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold transition-colors">
                                        Sell 10% Equity (-40 AP)
                                    </button>
                                </div>
                            )}
                            {finTab === 'b2b' && (
                                <div>
                                    <p className="text-slate-400 mb-4">Complete contracts for instant capital. Basic contracts require your AP. Corporate contracts require Team Stats.</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contracts.map(c => (
                                            <div key={c.id} className="bg-slate-800 p-4 rounded border border-slate-700">
                                                <div className="font-bold mb-2 text-lg text-white">{c.title}</div>
                                                <div className="flex justify-between text-sm mb-4">
                                                    <span className="text-green-400 font-mono font-bold">Pay: {formatMoney(c.reward)}</span>
                                                    {c.type === 'ap' ? (
                                                        <span className="text-yellow-400 font-bold">Req: {c.energyCost} AP</span>
                                                    ) : (
                                                        <span className="text-blue-400 font-bold uppercase text-xs">Req: {c.reqAmt} {c.reqStat}</span>
                                                    )}
                                                </div>
                                                <button onClick={()=>takeContract(c)} className="w-full bg-slate-700 hover:bg-osaccent hover:text-slate-900 py-2 rounded font-bold text-sm transition-colors">
                                                    {c.type === 'ap' ? 'Execute Manually' : 'Assign Team'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </WindowApp>
                )}

                {toast && <div className="absolute top-6 right-6 bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded shadow-2xl z-50 text-sm">{toast}</div>}
            </div>

            <div className="taskbar">
                <div className={`app-icon ${activeApp === 'mail' ? 'active' : ''}`} onClick={() => setActiveApp(activeApp === 'mail' ? null : 'mail')}><Icons.Mail />{inbox.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>}</div>
                <div className={`app-icon ${activeApp === 'product' ? 'active' : ''}`} onClick={() => setActiveApp(activeApp === 'product' ? null : 'product')}><Icons.Code /></div>
                <div className={`app-icon ${activeApp === 'team' ? 'active' : ''}`} onClick={() => setActiveApp(activeApp === 'team' ? null : 'team')}><Icons.Users /></div>
                <div className={`app-icon ${activeApp === 'finance' ? 'active' : ''}`} onClick={() => setActiveApp(activeApp === 'finance' ? null : 'finance')}><Icons.Bank /></div>
            </div>
        </div>
    );
};

export default App;
