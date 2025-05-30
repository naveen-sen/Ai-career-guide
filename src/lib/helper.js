export const entriesMarkdown = (entries,type) => {
    if(!entries?.length) return ""
    return `## ${type}\n\n` +
    entries.map((entry)=>{
        const dataRange = entry.current
        ? `${entry.startDate} - Present`
        : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} at ${entry.organization}\n (${dataRange})\n\n${entry.description}\n\n`;
    })
    .join("\n\n")
    
};