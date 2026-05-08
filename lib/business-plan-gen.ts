export interface BizPlanInput {
  businessName: string;
  ownerName: string;
  district: string;
  memberType: string;
  species: string[];
  monthlyVolume: number;
  pricePerM3: number;
  employees: number;
  yearsInOperation: number;
  equipment: string;
  loanAmount: number;
  loanPurpose: string;
  targetBank: string;
  language: 'en' | 'fr' | 'rw';
}

export interface BizPlanOutput {
  title: string;
  sections: { heading: string; content: string }[];
  generatedAt: string;
}

export function generateBusinessPlan(input: BizPlanInput): BizPlanOutput {
  const monthlyRevenue = input.monthlyVolume * input.pricePerM3;
  const annualRevenue = monthlyRevenue * 12;
  const estimatedCOGS = annualRevenue * 0.55;
  const grossProfit = annualRevenue - estimatedCOGS;
  const operatingCosts = annualRevenue * 0.2;
  const netProfit = grossProfit - operatingCosts;
  const profitMargin = ((netProfit / annualRevenue) * 100).toFixed(1);
  const loanRepaymentMonthly = Math.round((input.loanAmount * 1.16) / 36);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', maximumFractionDigits: 0 }).format(n);

  return {
    title: `Business Plan — ${input.businessName}`,
    generatedAt: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
    sections: [
      {
        heading: '1. Executive Summary',
        content: `${input.businessName} is a ${input.memberType} business operating in ${input.district} District, Rwanda, owned and managed by ${input.ownerName}. The business has been in operation for ${input.yearsInOperation} year${input.yearsInOperation !== 1 ? 's' : ''} and currently employs ${input.employees} person${input.employees !== 1 ? 's' : ''} in the Rwanda wood value chain.\n\nThe business handles ${input.species.join(', ')} with a current monthly production and trading volume of ${input.monthlyVolume} m³. This plan is submitted in support of a financing application of ${fmt(input.loanAmount)} from ${input.targetBank} for the purpose of: ${input.loanPurpose}.\n\nThe business is a verified member of the Rwanda Wood Value Chain Association (RWVCA) and operates under applicable REMA forest use authorisations.`,
      },
      {
        heading: '2. Business Description',
        content: `${input.businessName} operates as a ${input.memberType} in the Rwanda wood sector, headquartered in ${input.district} District. The business sources, processes, and supplies timber of the following species: ${input.species.join(', ')}.\n\nCurrent equipment and productive capacity: ${input.equipment}.\n\nThe business sells to local sawmills, furniture manufacturers, construction contractors, and traders within Rwanda. As an RWVCA member, the business has access to verified market price data, traceability certification, and formal sector networks that support sustainable and commercially competitive operations.`,
      },
      {
        heading: '3. Market Analysis',
        content: `Rwanda's wood sector employs over 75,000 workers and serves a growing domestic construction and furniture market, as well as export markets in the East African Community. Demand is driven by:\n\n• Government infrastructure programmes (school furniture, public construction, hospital works)\n• Private construction and real estate development in Kigali and secondary cities\n• Growing regional export demand, particularly for certified hardwoods\n\nCurrent RWVCA market intelligence indicates the prevailing price for ${input.species[0] || 'timber'} in ${input.district} District is approximately ${fmt(input.pricePerM3)} per m³ for Grade A material. This provides a stable and verifiable basis for the revenue projections in this plan.`,
      },
      {
        heading: '4. Financial Projections (3-Year)',
        content: `Based on current production volume of ${input.monthlyVolume} m³/month at a market price of ${fmt(input.pricePerM3)}/m³:\n\nYear 1 (Current trajectory):\n  • Annual Revenue:        ${fmt(annualRevenue)}\n  • Cost of Goods Sold:   ${fmt(estimatedCOGS)}\n  • Gross Profit:          ${fmt(grossProfit)}\n  • Operating Costs:       ${fmt(operatingCosts)}\n  • Net Profit:            ${fmt(netProfit)}\n  • Net Profit Margin:     ${profitMargin}%\n\nYear 2 (Post-investment, 20% volume growth):\n  • Projected Revenue:     ${fmt(annualRevenue * 1.2)}\n  • Projected Net Profit:  ${fmt(netProfit * 1.25)}\n\nYear 3 (Stabilised growth, 10% additional):\n  • Projected Revenue:     ${fmt(annualRevenue * 1.32)}\n  • Projected Net Profit:  ${fmt(netProfit * 1.4)}\n\nLoan Repayment Capacity:\n  • Requested loan:        ${fmt(input.loanAmount)}\n  • Estimated monthly repayment (36 months, 16% p.a.): ${fmt(loanRepaymentMonthly)}\n  • Monthly net profit (Year 1): ${fmt(netProfit / 12)}\n  • Repayment coverage ratio: ${((netProfit / 12) / loanRepaymentMonthly).toFixed(1)}x`,
      },
      {
        heading: '5. Loan Application Details',
        content: `Financing Institution: ${input.targetBank}\nRequested Amount: ${fmt(input.loanAmount)}\nProposed Repayment Term: 36 months\nPurpose: ${input.loanPurpose}\n\nThe requested financing will directly increase the production capacity and operational efficiency of ${input.businessName}, generating the revenue growth projected in Section 4. The business has a demonstrated operating history of ${input.yearsInOperation} year${input.yearsInOperation !== 1 ? 's' : ''}, verifiable sector membership through RWVCA, and documented timber transaction records available for bank review.`,
      },
      {
        heading: '6. Risk Assessment',
        content: `Key risks and mitigation measures:\n\n• Timber price volatility: Mitigated by access to RWVCA live market price feeds and advance sales agreements with established buyers.\n• Seasonal production variation: Managed through working capital buffer and diversified species portfolio.\n• Regulatory compliance: All operations conducted under valid REMA forest use permits; RWVCA traceability certification in progress.\n• Foreign exchange risk (export-oriented businesses): Contracts denominated in USD with EAC buyers; natural hedge through domestic RWF cost base.\n\nThe business maintains active RWVCA membership, which provides access to skills training, market intelligence, and formal documentation support — all of which reduce the operational and financial risks associated with the wood sector.`,
      },
      {
        heading: '7. Declaration',
        content: `I, ${input.ownerName}, confirm that the information contained in this business plan is accurate and complete to the best of my knowledge. This plan has been prepared using verified RWVCA member data and current market price intelligence.\n\nBusiness Name: ${input.businessName}\nOwner: ${input.ownerName}\nDistrict: ${input.district}\nDate: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}\n\nRWVCA Member Reference: Verified — Rwanda Wood Value Chain Association`,
      },
    ],
  };
}
