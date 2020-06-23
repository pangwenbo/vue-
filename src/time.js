const gettime = {
        // 获取聊天时间（相差120s内的信息不会显示时间）
        getChatTime(v1, v2) {
                v1 = v1.toString().length < 13 ? v1 * 1000 : v1;
                v2 = v2.toString().length < 13 ? v2 * 1000 : v2;
                if (((parseInt(v1) - parseInt(v2)) / 1000) > 120) {
                        return this.gettime(v1);
                }
        },
        // 人性化时间格式
        gettime(shorttime) {
                shorttime = shorttime.toString().length < 13 ? shorttime * 1000 : shorttime;
                let now = (new Date()).getTime();
                let cha = (now - parseInt(shorttime)) / 1000;
                shorttime = parseInt(shorttime)
                if (cha < 43200) {
                        // 当天
                        return this.dateFormat(new Date(shorttime), "{A} {T}:{II}");
                } else if (cha < 518400) {
                        // 隔天 显示日期+时间
                        return this.dateFormat(new Date(shorttime), "{MON}月{DD}日 {A} {T}:{II}");
                } else {
                        // 隔年 显示完整日期+时间
                        return this.dateFormat(new Date(shorttime), "{Y}-{MM}-{DD} {A} {T}:{II}");
                }
        },

        parseNumber(num) {
                return num < 10 ? "0" + num : num;
        },

        dateFormat(date, formatStr) {
                let dateObj = {},
                        rStr = /\{([^}]+)\}/,
                        mons = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
                dateObj["Y"] = date.getFullYear();
                dateObj["M"] = date.getMonth() + 1;
                dateObj["MM"] = this.parseNumber(dateObj["M"]);
                dateObj["MON"] = mons[dateObj['M'] - 1];
                dateObj["D"] = date.getDate();
                dateObj["DD"] = this.parseNumber(dateObj["D"]);
                dateObj["H"] = date.getHours();
                dateObj["HH"] = this.parseNumber(dateObj["H"]);
                dateObj["T"] = dateObj["H"] > 12 ? dateObj["H"] - 12 : dateObj["H"];
                dateObj["TT"] = this.parseNumber(dateObj["t"]);
                dateObj["A"] = dateObj["H"] > 12 ? '下午' : '上午';
                dateObj["I"] = date.getMinutes();
                dateObj["II"] = this.parseNumber(dateObj["I"]);
                dateObj["SS"] = date.getSeconds();
                dateObj["SS"] = this.parseNumber(dateObj["S"]);

                while (rStr.test(formatStr)) {
                        formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
                }

                return formatStr;
        }
}

export default {
        gettime
}