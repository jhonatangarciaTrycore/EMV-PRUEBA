import { db } from '../db.config.js';

const evmService = {};

const toNumber = (value) => Number(value);

const round = (value, decimals = 2) => {
    if (value === null || value === undefined) {
        return null;
    }

    return Number(value.toFixed(decimals));
};

const calculateEvm = ({ bac, plannedPercent, actualPercent, actualCost }) => {
    const pv = (bac * plannedPercent) / 100;
    const ev = (bac * actualPercent) / 100;
    const ac = actualCost;

    const cv = ev - ac;
    const sv = ev - pv;

    const cpi = ac === 0 ? null : ev / ac;
    const spi = pv === 0 ? null : ev / pv;

    const eac = cpi === null || cpi === 0 ? null : bac / cpi;
    const vac = eac === null ? null : bac - eac;

    return {
        pv: round(pv),
        ev: round(ev),
        ac: round(ac),
        cv: round(cv),
        sv: round(sv),
        cpi: {
            value: cpi === null ? null : round(cpi, 4),
            interpretation: cpi === null ? 'Sin datos' : cpi < 1 ? 'Por debajo del presupuesto' : cpi > 1 ? 'Por encima del presupuesto' : 'En presupuesto',
        },
        spi: {
            value: spi === null ? null : round(spi, 4),
            interpretation: spi === null ? 'Sin datos' : spi > 1 ? 'Adelantado' : spi === 1 ? 'En tiempo' : 'Atrasado',
        },
        eac: eac === null ? null : round(eac),
        vac: vac === null ? null : round(vac),
    };
};

evmService.getActivityEvm = async (activityId) => {
    try {
        const query = `
            SELECT
                id,
                project_id,
                nombre,
                bac,
                planned_percent,
                actual_percent,
                actual_cost,
                created_at,
                updated_at
            FROM activities
            WHERE id = $1
            LIMIT 1
        `;

        const result = await db.query(query, [activityId]);
        const activity = result.rows[0];

        const evm = calculateEvm({
            bac: toNumber(activity.bac),
            plannedPercent: toNumber(activity.planned_percent),
            actualPercent: toNumber(activity.actual_percent),
            actualCost: toNumber(activity.actual_cost),
        });

        return {
            msg: 'EVM de actividad obtenido correctamente',
            activity: {
                ...activity,
                evm,
            },
        };
    } catch (error) {
        throw new Error('No se pudo obtener el EVM de la actividad');
    }
};

evmService.getProjectEvm = async (projectId, activities) => {
    try {
        const projectResult = await db.query(
            'SELECT id, nombre FROM projects WHERE id = $1 LIMIT 1',
            [projectId]
        );

        const project = projectResult.rows[0];

        const mappedActivities = activities.map((activity) => {
            const evm = calculateEvm({
                bac: toNumber(activity.bac),
                plannedPercent: toNumber(activity.planned_percent),
                actualPercent: toNumber(activity.actual_percent),
                actualCost: toNumber(activity.actual_cost),
            });

            return {
                ...activity,
                evm,
            };
        });

        // Calcular totales para el proyecto
        const totals = mappedActivities.reduce(
            (acc, activity) => {
                acc.bac += toNumber(activity.bac);
                acc.pv += activity.evm.pv;
                acc.ev += activity.evm.ev;
                acc.ac += activity.evm.ac;

                return acc;
            },
            { bac: 0, pv: 0, ev: 0, ac: 0 }
        );

        const plannedPercent = totals.bac === 0 ? 0 : (totals.pv / totals.bac) * 100;
        const actualPercent = totals.bac === 0 ? 0 : (totals.ev / totals.bac) * 100;

        // Calcular EVM del proyecto usando los totales, sacando los porcentajes a partir de los totales
        const projectEvm = calculateEvm({
            bac: totals.bac,
            plannedPercent,
            actualPercent,
            actualCost: totals.ac,
        });


        return {
            msg: 'EVM de proyecto obtenido correctamente',
            project,
            activities: mappedActivities,
            evm: {...projectEvm, bac: totals.bac},
        };
    } catch (error) {
        throw new Error('No se pudo obtener el EVM del proyecto');
    }
};

export { evmService };