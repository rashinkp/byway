#!/usr/bin/env ts-node

/**
 * Migration Script for Generic Repository Pattern
 * 
 * This script helps identify repositories that need to be migrated to the GenericRepository pattern.
 * It analyzes the existing repository implementations and provides guidance on what needs to be done.
 */

import * as fs from 'fs';
import * as path from 'path';

interface RepositoryInfo {
  name: string;
  filePath: string;
  hasGenericImport: boolean;
  extendsGeneric: boolean;
  hasCommonMethods: string[];
  entitySpecificMethods: string[];
  estimatedMigrationTime: 'low' | 'medium' | 'high';
}

class RepositoryAnalyzer {
  private repositories: RepositoryInfo[] = [];
  private readonly repositoriesDir = path.join(__dirname, '../infra/repositories');

  async analyzeRepositories(): Promise<void> {
    console.log('🔍 Analyzing repository implementations...\n');

    const files = fs.readdirSync(this.repositoriesDir);
    const repositoryFiles = files.filter(file => 
      file.endsWith('.ts') && 
      !file.includes('.test.') && 
      !file.includes('.spec.') &&
      !file.includes('base/')
    );

    for (const file of repositoryFiles) {
      const filePath = path.join(this.repositoriesDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const repoInfo = this.analyzeRepository(file, filePath, content);
      this.repositories.push(repoInfo);
    }

    this.generateReport();
  }

  private analyzeRepository(fileName: string, filePath: string, content: string): RepositoryInfo {
    const name = fileName.replace('.ts', '').replace('.impl', '');
    
    const hasGenericImport = content.includes('import.*GenericRepository') || 
                            content.includes('from "./base/generic.repository"');
    
    const extendsGeneric = content.includes('extends GenericRepository');
    
    const commonMethods = this.findCommonMethods(content);
    const entitySpecificMethods = this.findEntitySpecificMethods(content);
    
    const estimatedMigrationTime = this.estimateMigrationTime(commonMethods.length, entitySpecificMethods.length);

    return {
      name,
      filePath,
      hasGenericImport,
      extendsGeneric,
      hasCommonMethods: commonMethods,
      entitySpecificMethods,
      estimatedMigrationTime
    };
  }

  private findCommonMethods(content: string): string[] {
    const commonMethodPatterns = [
      'async findById',
      'async create',
      'async update', 
      'async delete',
      'async save',
      'async find',
      'async findAll'
    ];

    return commonMethodPatterns.filter(pattern => content.includes(pattern));
  }

  private findEntitySpecificMethods(content: string): string[] {
    const methodMatches = content.match(/async\s+(\w+)\s*\(/g);
    if (!methodMatches) return [];

    const entitySpecificPatterns = [
      'findByEmail',
      'findByUserId', 
      'findByCourseId',
      'findByLessonId',
      'findByName',
      'findByUserAndCourse',
      'clearUserCart',
      'deleteByUserAndCourse',
      'countByUserId',
      'findByStatus',
      'findByType'
    ];

    return methodMatches
      .map(match => match.replace('async ', '').replace('(', ''))
      .filter(method => entitySpecificPatterns.some(pattern => method.includes(pattern)));
  }

  private estimateMigrationTime(commonMethodsCount: number, entitySpecificCount: number): 'low' | 'medium' | 'high' {
    if (commonMethodsCount <= 2 && entitySpecificCount <= 3) return 'low';
    if (commonMethodsCount <= 4 && entitySpecificCount <= 6) return 'medium';
    return 'high';
  }

  private generateReport(): void {
    console.log('📊 Repository Migration Analysis Report\n');
    console.log('=' .repeat(80));

    const migrated = this.repositories.filter(r => r.extendsGeneric);
    const pending = this.repositories.filter(r => !r.extendsGeneric);

    console.log(`✅ Already Migrated: ${migrated.length}`);
    console.log(`⏳ Pending Migration: ${pending.length}\n`);

    if (migrated.length > 0) {
      console.log('✅ MIGRATED REPOSITORIES:');
      migrated.forEach(repo => {
        console.log(`  - ${repo.name}`);
      });
      console.log();
    }

    if (pending.length > 0) {
      console.log('⏳ PENDING MIGRATION:');
      pending.forEach(repo => {
        const status = repo.hasGenericImport ? '🔄 Partially Migrated' : '📝 Not Started';
        console.log(`  ${status} - ${repo.name} (${repo.estimatedMigrationTime} effort)`);
        
        if (repo.hasCommonMethods.length > 0) {
          console.log(`    Common methods to migrate: ${repo.hasCommonMethods.join(', ')}`);
        }
        
        if (repo.entitySpecificMethods.length > 0) {
          console.log(`    Entity-specific methods to keep: ${repo.entitySpecificMethods.join(', ')}`);
        }
        console.log();
      });
    }

    this.generateMigrationGuide();
  }

  private generateMigrationGuide(): void {
    console.log('📋 MIGRATION GUIDE');
    console.log('=' .repeat(80));

    const pending = this.repositories.filter(r => !r.extendsGeneric);
    
    if (pending.length === 0) {
      console.log('🎉 All repositories have been migrated!');
      return;
    }

    console.log('\nRecommended migration order (by complexity):\n');

    const sortedByComplexity = pending.sort((a, b) => {
      const complexityMap = { low: 1, medium: 2, high: 3 };
      return complexityMap[a.estimatedMigrationTime] - complexityMap[b.estimatedMigrationTime];
    });

    sortedByComplexity.forEach((repo, index) => {
      console.log(`${index + 1}. ${repo.name} (${repo.estimatedMigrationTime} effort)`);
    });

    console.log('\n📝 MIGRATION STEPS:');
    console.log('1. Import GenericRepository: import { GenericRepository } from "./base/generic.repository"');
    console.log('2. Extend the class: export class YourRepo extends GenericRepository<YourEntity>');
    console.log('3. Add constructor with super call: super(_prisma, "modelName")');
    console.log('4. Implement abstract methods: getPrismaModel(), mapToEntity(), mapToPrismaData()');
    console.log('5. Replace common CRUD methods with generic calls');
    console.log('6. Keep entity-specific methods unchanged');
    console.log('7. Test thoroughly');

    console.log('\n🔧 QUICK MIGRATION TEMPLATE:');
    console.log(`
// Before
export class YourRepository implements IYourRepository {
  constructor(private _prisma: PrismaClient) {}
  
  async findById(id: string): Promise<YourEntity | null> {
    const entity = await this._prisma.yourModel.findUnique({
      where: { id, deletedAt: null },
    });
    return entity ? YourEntity.fromPersistence(entity) : null;
  }
}

// After  
export class YourRepository extends GenericRepository<YourEntity> implements IYourRepository {
  constructor(private _prisma: PrismaClient) {
    super(_prisma, 'yourModel');
  }

  protected getPrismaModel() {
    return this._prisma.yourModel;
  }

  protected mapToEntity(data: any): YourEntity {
    return YourEntity.fromPersistence(data);
  }

  protected mapToPrismaData(entity: any): any {
    if (entity instanceof YourEntity) {
      return entity.toJSON();
    }
    return entity;
  }

  async findById(id: string): Promise<YourEntity | null> {
    return this.findByIdGeneric(id);
  }
}
    `);
  }
}

// Run the analysis
async function main() {
  const analyzer = new RepositoryAnalyzer();
  await analyzer.analyzeRepositories();
}

if (require.main === module) {
  main().catch(console.error);
}

export { RepositoryAnalyzer };
