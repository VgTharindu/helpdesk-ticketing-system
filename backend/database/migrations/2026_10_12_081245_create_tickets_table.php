<?php
use App\Enums\TicketStatus;
use App\Enums\TicketPriority;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('agent_id')->nullable()->constrained('users');
            $table->string('subject');
            $table->text('description');
            $table->enum('priority', array_column(TicketPriority::cases(), 'value'))->default(TicketPriority::Medium->value);
            $table->enum('status', array_column(TicketStatus::cases(), 'value'))->default(TicketStatus::Open->value);
            $table->timestamps();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
