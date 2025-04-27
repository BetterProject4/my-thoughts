"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashtagService = void 0;
const common_1 = require("@nestjs/common");
let HashtagService = class HashtagService {
    constructor() {
        this.staticHashtags = [
            '#DevLife',
            '#TechTwitter',
            '#RemoteWork',
            '#BuildInPublic',
            '#LifeOfADev',
            '#FreelanceLife',
            '#WorkInProgress',
            '#NaijaTech',
            '#GrindMode',
        ];
        this.trendingHashtags = [
            '#ElClasico',
            '#LiveWithChude',
            '#TensionByEazieBoi',
            '#MakemationInCinemas',
            '#JAMB',
            '#Barça',
            '#Yamal',
            '#Mbappe',
            '#Rudiger',
            '#Tottenham',
        ];
    }
    async pickRandomHashtag() {
        const useTrending = Math.random() < 0.3;
        if (useTrending && this.trendingHashtags.length > 0) {
            const randomTrending = Math.floor(Math.random() * this.trendingHashtags.length);
            return this.trendingHashtags[randomTrending];
        }
        const randomStatic = Math.floor(Math.random() * this.staticHashtags.length);
        return this.staticHashtags[randomStatic];
    }
};
exports.HashtagService = HashtagService;
exports.HashtagService = HashtagService = __decorate([
    (0, common_1.Injectable)()
], HashtagService);
//# sourceMappingURL=hashtag.service.js.map